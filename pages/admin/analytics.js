import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../components/Layout";
import AdminShell from "../../components/admin/AdminShell";
import { adminAuthFetch, useAdminSession } from "../../lib/admin-portal/use-admin-session";
import {
  ADMIN_ANALYTICS_TITLE,
  ADMIN_LOADING,
  ADMIN_LOAD_ERROR,
  adminGradeLabelHe,
  apiErrorMessageHe,
} from "../../lib/admin-portal/admin-ui.js";
import {
  ANALYTICS_CHILD_STATUS_OPTIONS,
  ANALYTICS_DATE_PRESETS,
  ANALYTICS_GRADE_FILTER_OPTIONS,
  ANALYTICS_MAIN_TAB_OPTIONS,
  ANALYTICS_SUBJECT_FILTER_OPTIONS,
  formatAnalyticsGradeHe,
  formatAnalyticsLabelHe,
  formatAnalyticsSourceHe,
  formatAnalyticsTableHe,
  formatAnalyticsUnitHe,
  formatWebTrafficLabelHe,
} from "../../lib/admin-portal/admin-analytics-labels.js";
import { trackProductEvent } from "../../lib/analytics/track-event.client.js";
import {
  mergeFacebookReferrers,
  pickUserActivityValue,
  splitVisitorAndAdminPages,
  sumLearningAndGames,
} from "../../lib/admin-portal/admin-web-traffic-display.js";

const PRESETS = ANALYTICS_DATE_PRESETS;

const GRADES = [
  ...ANALYTICS_GRADE_FILTER_OPTIONS,
  { value: "g1", label: adminGradeLabelHe("g1") },
  { value: "g2", label: adminGradeLabelHe("g2") },
  { value: "g3", label: adminGradeLabelHe("g3") },
  { value: "g4", label: adminGradeLabelHe("g4") },
  { value: "g5", label: adminGradeLabelHe("g5") },
  { value: "g6", label: adminGradeLabelHe("g6") },
];

const SUBJECTS = ANALYTICS_SUBJECT_FILTER_OPTIONS;

const CHILD_STATUSES = ANALYTICS_CHILD_STATUS_OPTIONS;

/** Main navigation tabs — only one tab panel visible at a time. */
export const ANALYTICS_MAIN_TABS = ANALYTICS_MAIN_TAB_OPTIONS;

function formatDateHe(iso) {
  if (!iso || typeof iso !== "string") return iso || "-";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function labelFromOptions(value, options, fallback = "-") {
  return options.find((item) => item.value === value)?.label || fallback;
}

function buildFilterSummary({ preset, from, to, grade, subject, childStatus, dashboard }) {
  const presetLabel = labelFromOptions(preset, PRESETS, preset);
  const gradeLabel = labelFromOptions(grade, GRADES, grade);
  const subjectLabel = labelFromOptions(subject, SUBJECTS, subject);
  const childLabel = labelFromOptions(childStatus, CHILD_STATUSES, childStatus);
  const rangeFrom = dashboard?.filters?.range?.fromDateOnly || from;
  const rangeTo = dashboard?.filters?.range?.toDateOnly || to;
  return `Range: ${presetLabel} · ${formatDateHe(rangeFrom)} - ${formatDateHe(rangeTo)} · ${gradeLabel} · ${subjectLabel} · ${childLabel}`;
}

function FilterSummaryBar({
  summary,
  open,
  onToggle,
  children,
}) {
  return (
    <section
      className="rounded-xl border border-white/10 bg-white/[0.03] p-2 w-full max-w-full overflow-x-hidden"
      data-analytics-filter-summary
      data-analytics-filters-open={open ? "true" : "false"}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs sm:text-sm text-white/70 break-words flex-1 min-w-0">{summary}</p>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/5"
        >
          {open ? "Close Filters" : "Change Filters"}
        </button>
      </div>
      {open ? <div className="mt-2 pt-2 border-t border-white/10">{children}</div> : null}
    </section>
  );
}

const WEB_TRAFFIC_PRESETS = [
  { value: "today", label: "Today" },
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
];

function webTrafficPresetFromDashboard(preset) {
  return WEB_TRAFFIC_PRESETS.some((item) => item.value === preset) ? preset : "last30";
}

function mergeActivityFunnel(userActivityFunnel, webTraffic) {
  if (!userActivityFunnel) return null;
  const visitors = webTraffic?.status === "available" ? webTraffic.summary?.visitors : null;
  const steps = (userActivityFunnel.steps || []).map((step) => {
    if (step.key !== "visitors") return step;
    return {
      ...step,
      value: visitors,
      placeholder: visitors == null,
      status: webTraffic?.status === "not_configured" ? "not_configured" : visitors == null ? "unavailable" : "available",
    };
  });
  return { ...userActivityFunnel, steps };
}

function formatTrafficNumber(value) {
  if (value == null || value === "") return "-";
  return new Intl.NumberFormat("he-IL").format(value);
}

function ActivityFunnelSummary({ funnel }) {
  if (!funnel?.steps?.length) {
    return <p className="text-sm text-white/50">No data yet</p>;
  }
  return (
    <div className="space-y-2">
      {funnel.disclaimer ? (
        <p className="text-xs text-white/55 leading-relaxed">{funnel.disclaimer}</p>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
        {funnel.steps.map((step) => (
          <div key={step.key} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-[11px] text-white/55 mb-1">{formatAnalyticsLabelHe(step.label)}</p>
            <p className="text-xl font-bold text-white">
              {step.placeholder && step.value == null ? "-" : formatTrafficNumber(step.value)}
            </p>
            <p className="text-[10px] text-white/40 mt-1 break-words">Source: {formatAnalyticsSourceHe(step.source)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebTrafficPresetBar({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {WEB_TRAFFIC_PRESETS.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
            value === item.value
              ? "border-amber-400/50 bg-amber-400/15 text-amber-100"
              : "border-white/15 text-white/75 hover:bg-white/5"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

const WEB_TRAFFIC_LOADING_TEXT = "Loading data…";

function WebTrafficStatCard({ title, value, hint, loading, error }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 min-h-[7.5rem] flex flex-col justify-between">
      <p className="text-sm text-white/75">{title}</p>
      {loading ? (
        <p className="text-base text-white/50 mt-2">{WEB_TRAFFIC_LOADING_TEXT}</p>
      ) : error ? (
        <p className="text-sm text-red-300 mt-2">{error}</p>
      ) : (
        <>
          <p className="text-3xl font-bold text-white leading-tight mt-2">{value}</p>
          {hint ? <p className="text-xs text-white/50 mt-2 leading-relaxed">{hint}</p> : null}
        </>
      )}
    </div>
  );
}

function WebTrafficSection({ title, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
      <h3 className="text-base font-semibold text-white/90">{title}</h3>
      {children}
    </section>
  );
}

function webTrafficQuantityCell(row) {
  const amount = row.value ?? row.pageviews ?? row.visitors;
  return formatTrafficNumber(amount);
}

function WebTrafficTable({ rows, dimension = "generic", nameLabel = "Name", empty = "No data in this range" }) {
  return (
    <SimpleTable
      rows={rows}
      columns={[
        {
          key: "label",
          label: nameLabel,
          render: (row) =>
            formatWebTrafficLabelHe(row.rawLabel || row.label || row.key, row.dimension || dimension),
        },
        { key: "value", label: "Count", render: webTrafficQuantityCell },
      ]}
      empty={empty}
    />
  );
}

function buildWebTrafficViewModel({
  webTraffic,
  webTrafficLoading,
  webTrafficError,
  webTrafficUserActivity,
  webTrafficUserActivityLoading,
  webTrafficUserActivityError,
}) {
  const trafficLoading = webTrafficLoading;
  const activityLoading = webTrafficUserActivityLoading;
  const trafficError = webTrafficError || (webTraffic?.status === "not_configured" ? webTraffic.message : webTraffic?.status !== "available" && webTraffic?.message ? webTraffic.message : "");
  const activityError = webTrafficUserActivityError;
  const trafficReady = !trafficLoading && !trafficError && webTraffic?.status === "available";
  const activityReady = !activityLoading && !activityError && webTrafficUserActivity;

  const { visitorPages, adminPages } = splitVisitorAndAdminPages(webTraffic?.topPages);
  const { merged: mergedReferrers, facebookTotal } = mergeFacebookReferrers(webTraffic?.referrers);
  const topVisitorPage = visitorPages[0] || null;
  const topPageLabel = topVisitorPage
    ? formatWebTrafficLabelHe(topVisitorPage.rawLabel || topVisitorPage.label, "requestPath")
    : null;

  const activityCards = webTrafficUserActivity?.cards;

  return {
    trafficLoading,
    activityLoading,
    trafficError: trafficError || null,
    activityError: activityError || null,
    trafficReady,
    activityReady,
    visitors: trafficReady ? webTraffic.summary?.visitors : null,
    pageviews: trafficReady ? webTraffic.summary?.pageviews : null,
    facebookEntries: trafficReady ? facebookTotal : null,
    topPageLabel,
    topPageViews: trafficReady && topVisitorPage ? topVisitorPage.value ?? topVisitorPage.pageviews : null,
    daily: trafficReady ? webTraffic.daily || [] : [],
    visitorPages: trafficReady ? visitorPages : [],
    adminPages: trafficReady ? adminPages : [],
    referrers: trafficReady ? mergedReferrers : [],
    devices: trafficReady ? webTraffic.devices || [] : [],
    newGuests: activityReady ? pickUserActivityValue(activityCards, "New guest accounts created") : null,
    newParents: activityReady ? pickUserActivityValue(activityCards, "New parents") : null,
    activeUsers: activityReady ? pickUserActivityValue(activityCards, "Users with real activity") : null,
    learningAndGames: activityReady ? sumLearningAndGames(activityCards) : null,
  };
}

function WebTrafficTabContent({
  webTrafficPreset,
  onPresetChange,
  webTraffic,
  webTrafficLoading,
  webTrafficError,
  webTrafficUserActivity,
  webTrafficUserActivityLoading,
  webTrafficUserActivityError,
  publicWorksheetVisits,
}) {
  const model = buildWebTrafficViewModel({
    webTraffic,
    webTrafficLoading,
    webTrafficError,
    webTrafficUserActivity,
    webTrafficUserActivityLoading,
    webTrafficUserActivityError,
  });

  const trafficCardProps = {
    loading: model.trafficLoading,
    error: model.trafficError,
  };
  const activityCardProps = {
    loading: model.activityLoading,
    error: model.activityError,
  };

  return (
    <div className="space-y-4">
      <WebTrafficPresetBar value={webTrafficPreset} onChange={onPresetChange} />

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-white/80">Web traffic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <WebTrafficStatCard
            title="Visitors"
            value={formatTrafficNumber(model.visitors)}
            hint="How many people visited the site"
            {...trafficCardProps}
          />
          <WebTrafficStatCard
            title="Page views"
            value={formatTrafficNumber(model.pageviews)}
            hint="How many pages Opened in total"
            {...trafficCardProps}
          />
          <WebTrafficStatCard
            title="Facebook entries"
            value={formatTrafficNumber(model.facebookEntries)}
            hint="Arrivals from Facebook"
            {...trafficCardProps}
          />
          <WebTrafficStatCard
            title="Most viewed page"
            value={formatTrafficNumber(model.topPageViews)}
            hint={model.topPageLabel || "No data yet"}
            {...trafficCardProps}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-white/80">Site activity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <WebTrafficStatCard
            title="Label"
            value={formatTrafficNumber(model.newGuests)}
            hint="Children signed in as guests"
            {...activityCardProps}
          />
          <WebTrafficStatCard
            title="New parents"
            value={formatTrafficNumber(model.newParents)}
            hint="Parents registered for the first time"
            {...activityCardProps}
          />
          <WebTrafficStatCard
            title="Active users"
            value={formatTrafficNumber(model.activeUsers)}
            hint="Label"
            {...activityCardProps}
          />
          <WebTrafficStatCard
            title="Learning and games"
            value={formatTrafficNumber(model.learningAndGames)}
            hint="Total sessions of Learning and play"
            {...activityCardProps}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-white/80">Public worksheet generator</h2>
        <p className="text-xs text-white/50 leading-relaxed">
          Visit counts in this tab only (sessionStorage) — uses the main filter range at the top of the page.
        </p>
        <MetricGrid items={publicWorksheetVisits?.cards} />
      </div>

      {!model.trafficLoading && !model.trafficError ? (
        <div className="space-y-4">
          <WebTrafficSection title="Views by day">
            <WebTrafficTable
              rows={model.daily}
              dimension="daily"
              nameLabel="Date"
              empty="No data yet"
            />
          </WebTrafficSection>

          <WebTrafficSection title="Top pages">
            <WebTrafficTable
              rows={model.visitorPages}
              dimension="requestPath"
              nameLabel="Page"
              empty="No data yet"
            />
            {model.adminPages.length ? (
              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
                <h4 className="text-sm font-semibold text-white/70">Admin activity</h4>
                <p className="text-xs text-white/45">Admin pages — not counted with regular visitors</p>
                <WebTrafficTable rows={model.adminPages} dimension="requestPath" nameLabel="Page" empty="No data" />
              </div>
            ) : null}
          </WebTrafficSection>

          <WebTrafficSection title="Traffic sources">
            <WebTrafficTable
              rows={model.referrers}
              dimension="referrerHostname"
              nameLabel="Source"
              empty="No data yet"
            />
          </WebTrafficSection>

          <WebTrafficSection title="Devices">
            <WebTrafficTable
              rows={model.devices}
              dimension="deviceType"
              nameLabel="Device"
              empty="No data yet"
            />
          </WebTrafficSection>
        </div>
      ) : model.trafficLoading ? (
        <p className="text-sm text-white/60">{WEB_TRAFFIC_LOADING_TEXT}</p>
      ) : model.trafficError ? (
        <p className="text-sm text-red-300">{model.trafficError}</p>
      ) : null}
    </div>
  );
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function thirtyDaysAgoIso() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 29);
  return d.toISOString().slice(0, 10);
}

function valueText(metric) {
  if (!metric) return "-";
  if (metric.status === "not_tracked") return "Not tracked yet";
  if (metric.status === "requires_events") return "Requires event collection";
  if (metric.status === "empty") return "No data yet";
  if (metric.status === "not_enough_data") return "Label";
  if (metric.status === "unavailable") return "Data source unavailable";
  if (metric.value === null || metric.value === undefined) return metric.note || "Not tracked yet";
  if (typeof metric.value === "number") {
    return new Intl.NumberFormat("he-IL", { maximumFractionDigits: 1 }).format(metric.value);
  }
  return String(metric.value);
}

function statusClass(status) {
  if (status === "available") return "border-emerald-400/20 bg-emerald-400/5";
  if (status === "partial") return "border-amber-400/30 bg-amber-400/10";
  if (status === "empty" || status === "not_enough_data") return "border-white/15 bg-white/[0.03]";
  if (status === "not_tracked" || status === "requires_events") return "border-cyan-400/25 bg-cyan-400/10";
  return "border-red-400/25 bg-red-400/10";
}

function metricsSummary(items) {
  if (!Array.isArray(items) || items.length === 0) return "No data in this range";
  const available = items.find((item) => item?.status === "available" && item.value != null);
  if (available) {
    const unit = available.unit ? ` ${formatAnalyticsUnitHe(available.unit)}` : "";
    return `${formatAnalyticsLabelHe(available.label)}: ${valueText(available)}${unit}`;
  }
  const noteItem = items.find((item) => item?.note);
  if (noteItem?.note) return formatAnalyticsLabelHe(noteItem.note);
  if (items.every((item) => item?.status === "empty")) return "No data yet";
  if (items.every((item) => item?.status === "not_enough_data")) return "Label";
  if (items.some((item) => item?.status === "requires_events" || item?.status === "not_tracked")) {
    return "Label";
  }
  return `${items.length} metrics`;
}

function rowsSummary(rows, emptyText = "No data in this range") {
  if (!Array.isArray(rows) || rows.length === 0) return emptyText;
  const top = rows[0];
  if (top?.label != null && top?.value != null) {
    return `${formatAnalyticsLabelHe(top.label || top.key)}: ${top.value}`;
  }
  if (top?.date != null) return `${rows.length} rows · latest: ${top.date}`;
  return `${rows.length} rows`;
}

function MetricCard({ item }) {
  return (
    <div className={`rounded-xl border p-3 ${statusClass(item.status)}`}>
      <p className="text-[11px] text-white/55 mb-1">{formatAnalyticsLabelHe(item.label)}</p>
      <p className="text-xl font-bold text-white leading-tight">{valueText(item)}</p>
      {item.unit ? <p className="text-[11px] text-white/45 mt-0.5">{formatAnalyticsUnitHe(item.unit)}</p> : null}
      <p className="text-[10px] text-white/40 mt-1 break-words">Source: {formatAnalyticsSourceHe(item.source)}</p>
      {item.note && item.status !== "available" ? (
        <p className="text-[10px] text-amber-100/80 mt-1">{formatAnalyticsLabelHe(item.note)}</p>
      ) : null}
    </div>
  );
}

function MetricGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
      {(items || []).map((item, idx) => (
        <MetricCard key={`${item.label}-${idx}`} item={item} />
      ))}
    </div>
  );
}

function cellValue(row, col) {
  return col.render ? col.render(row) : formatAnalyticsLabelHe(row[col.key]) ?? "-";
}

function SimpleTable({ rows, columns, empty = "No data in this range" }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return <p className="text-sm text-white/50">{empty}</p>;
  }

  const useCardLayout = columns.length > 3;

  if (useCardLayout) {
    return (
      <div className="space-y-2 w-full max-w-full">
        {rows.map((row, idx) => (
          <div
            key={row.key || row.date || `${idx}`}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 text-sm">
                <span className="text-white/50 shrink-0">{col.label}</span>
                <span className="text-white/80 text-right break-words max-w-full">{cellValue(row, col)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden rounded-2xl border border-white/10">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-white/5 text-white/65">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2 text-right font-semibold break-words">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row, idx) => (
            <tr key={row.key || row.date || `${idx}`}>
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2 text-right break-words text-white/80 align-top">
                  {cellValue(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TopList({ title, rows }) {
  return (
    <div className={title ? "rounded-xl border border-white/10 bg-white/[0.02] p-2" : ""}>
      {title ? <h4 className="font-semibold mb-2 text-sm text-white/85">{title}</h4> : null}
      <SimpleTable
        rows={rows}
        columns={[
          { key: "label", label: "Name", render: (row) => formatAnalyticsLabelHe(row.label || row.key) },
          { key: "value", label: "Count" },
        ]}
      />
    </div>
  );
}

function FunnelList({ funnels }) {
  if (!Array.isArray(funnels) || !funnels.length) {
    return <p className="text-sm text-white/50">No data yet</p>;
  }
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
      {funnels.map((funnel) => (
        <div key={funnel.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-2">
          <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1 mb-2">
            <h4 className="font-semibold text-white/90 break-words">{formatAnalyticsLabelHe(funnel.name)}</h4>
            {funnel.note ? (
              <span className="text-xs text-white/45 break-words">{formatAnalyticsLabelHe(funnel.note)}</span>
            ) : null}
          </div>
          <SimpleTable
            rows={funnel.steps}
            columns={[
              { key: "label", label: "Step", render: (row) => formatAnalyticsLabelHe(row.label) },
              { key: "value", label: "Count", render: (row) => (row.value == null ? valueText(row) : row.value) },
              {
                key: "conversionFromPrevious",
                label: "Conversion",
                render: (row) => (row.conversionFromPrevious == null ? "-" : `${row.conversionFromPrevious}%`),
              },
              { key: "source", label: "Source", render: (row) => formatAnalyticsSourceHe(row.source) },
            ]}
          />
        </div>
      ))}
    </div>
  );
}

/** Collapsible analytics block — closed by default (`defaultOpen={false}`). */
export function CollapsiblePanel({
  panelId,
  title,
  subtitle,
  summary,
  defaultOpen = false,
  nested = false,
  isOpen,
  onToggle,
  children,
}) {
  const open = isOpen ?? defaultOpen;
  return (
    <section
      className={`rounded-xl border border-white/10 ${nested ? "bg-white/[0.02]" : "bg-slate-950/60"}`}
      data-analytics-panel={panelId}
      data-analytics-panel-open={open ? "true" : "false"}
    >
      <button
        type="button"
        onClick={() => onToggle(panelId)}
        aria-expanded={open}
        aria-controls={`panel-body-${panelId}`}
        className="w-full flex items-center gap-2 p-3 text-right hover:bg-white/[0.03] transition-colors rounded-xl"
      >
        <span
          className={`shrink-0 text-white/50 text-base leading-none transition-transform ${open ? "rotate-90" : ""}`}
          aria-hidden
        >
          ◀
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white/90 text-sm break-words">{title}</h3>
          {subtitle && open ? <p className="text-[11px] text-white/45 mt-0.5">{subtitle}</p> : null}
          {!open && summary ? <p className="text-xs text-amber-100/75 mt-0.5 truncate">{summary}</p> : null}
        </div>
      </button>
      {open ? (
        <div id={`panel-body-${panelId}`} className="px-3 pb-3 border-t border-white/10 pt-2 space-y-2">
          {children}
        </div>
      ) : null}
    </section>
  );
}

function AnalyticsTabBar({ activeTab, onChange }) {
  return (
    <nav
      className="rounded-xl border border-white/10 bg-white/[0.03] p-1.5 w-full max-w-full overflow-x-hidden"
      aria-label="Label"
      data-analytics-tab-bar
    >
      <div className="flex flex-wrap gap-1.5 w-full max-w-full">
        {ANALYTICS_MAIN_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={activeTab === tab.id ? "page" : undefined}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold text-center break-words max-w-full transition-colors ${
              activeTab === tab.id
                ? "bg-amber-500 text-slate-950 shadow ring-2 ring-amber-300/40"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function TabToolbar({ panelIds, openPanels, onOpenAll, onCloseAll }) {
  const openCount = panelIds.filter((id) => openPanels[id]).length;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
      <span>{openCount} of {panelIds.length} open panels</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpenAll(panelIds)}
          className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5 text-white/70 break-words"
        >
          Expand all in tab
        </button>
        <button
          type="button"
          onClick={() => onCloseAll(panelIds)}
          className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5 text-white/70 break-words"
        >
          Collapse all in tab
        </button>
      </div>
    </div>
  );
}

function usePanelToggleState() {
  const [openPanels, setOpenPanels] = useState({});

  const togglePanel = useCallback((panelId) => {
    setOpenPanels((prev) => ({ ...prev, [panelId]: !prev[panelId] }));
  }, []);

  const openAllPanels = useCallback((panelIds) => {
    setOpenPanels((prev) => {
      const next = { ...prev };
      for (const id of panelIds) next[id] = true;
      return next;
    });
  }, []);

  const closeAllPanels = useCallback((panelIds) => {
    setOpenPanels((prev) => {
      const next = { ...prev };
      for (const id of panelIds) next[id] = false;
      return next;
    });
  }, []);

  const isPanelOpen = useCallback((panelId) => !!openPanels[panelId], [openPanels]);

  return { openPanels, togglePanel, openAllPanels, closeAllPanels, isPanelOpen };
}

function Panel({ panelId, title, subtitle, summary, nested, toggle, isOpen, children }) {
  return (
    <CollapsiblePanel
      panelId={panelId}
      title={title}
      subtitle={subtitle}
      summary={summary}
      nested={nested}
      defaultOpen={false}
      isOpen={isOpen}
      onToggle={toggle}
    >
      {children}
    </CollapsiblePanel>
  );
}

export default function AdminAnalyticsPage() {
  const { state, accessToken } = useAdminSession();
  const [preset, setPreset] = useState("last30");
  const [from, setFrom] = useState(thirtyDaysAgoIso());
  const [to, setTo] = useState(todayIso());
  const [grade, setGrade] = useState("all");
  const [subject, setSubject] = useState("all");
  const [childStatus, setChildStatus] = useState("all");
  const [dashboard, setDashboard] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [webTrafficPreset, setWebTrafficPreset] = useState("last30");
  const [webTraffic, setWebTraffic] = useState(null);
  const [webTrafficLoading, setWebTrafficLoading] = useState(false);
  const [webTrafficError, setWebTrafficError] = useState("");
  const [webTrafficUserActivity, setWebTrafficUserActivity] = useState(null);
  const [webTrafficUserActivityLoading, setWebTrafficUserActivityLoading] = useState(false);
  const [webTrafficUserActivityError, setWebTrafficUserActivityError] = useState("");
  const trackedOpenKeyRef = useRef("");
  const { openPanels, togglePanel, openAllPanels, closeAllPanels, isPanelOpen } = usePanelToggleState();

  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("preset", preset);
    if (preset === "custom") {
      qs.set("from", from);
      qs.set("to", to);
    }
    qs.set("grade", grade);
    qs.set("subject", subject);
    qs.set("childStatus", childStatus);
    return qs.toString();
  }, [childStatus, from, grade, preset, subject, to]);

  const load = useCallback(async (token) => {
    setLoading(true);
    setLoadError("");
    const res = await adminAuthFetch(token, `/api/admin/analytics?${queryString}`);
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body?.data?.sections) {
      setDashboard(null);
      setLoadError(apiErrorMessageHe(body?.error, ADMIN_LOAD_ERROR));
      setLoading(false);
      return;
    }
    setDashboard(body.data);
    if (trackedOpenKeyRef.current !== queryString) {
      trackedOpenKeyRef.current = queryString;
      void trackProductEvent({
        eventName: "admin_analytics_opened",
        actorType: "admin",
        metadata: { preset, grade, subject, childStatus },
      });
    }
    setLoading(false);
  }, [childStatus, grade, preset, queryString, subject]);

  const loadWebTraffic = useCallback(async (token, trafficPreset) => {
    setWebTrafficLoading(true);
    setWebTrafficError("");
    setWebTraffic(null);
    const qs = new URLSearchParams({ preset: trafficPreset });
    const res = await adminAuthFetch(token, `/api/admin/analytics/web-traffic?${qs.toString()}`);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setWebTraffic(null);
      setWebTrafficError(apiErrorMessageHe(body?.error, ADMIN_LOAD_ERROR));
      setWebTrafficLoading(false);
      return;
    }
    setWebTraffic(body?.data || null);
    setWebTrafficLoading(false);
  }, []);

  const loadWebTrafficUserActivity = useCallback(async (token, trafficPreset) => {
    setWebTrafficUserActivityLoading(true);
    setWebTrafficUserActivityError("");
    setWebTrafficUserActivity(null);
    const qs = new URLSearchParams({
      preset: trafficPreset,
      grade: "all",
      subject: "all",
      childStatus: "all",
    });
    const res = await adminAuthFetch(token, `/api/admin/analytics?${qs.toString()}`);
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body?.data?.sections?.userActivity) {
      setWebTrafficUserActivity(null);
      setWebTrafficUserActivityError(apiErrorMessageHe(body?.error, ADMIN_LOAD_ERROR));
      setWebTrafficUserActivityLoading(false);
      return;
    }
    setWebTrafficUserActivity(body.data.sections.userActivity);
    setWebTrafficUserActivityLoading(false);
  }, []);

  useEffect(() => {
    setWebTrafficPreset(webTrafficPresetFromDashboard(preset));
  }, [preset]);

  useEffect(() => {
    if (state !== "ready" || !accessToken) return;
    void load(accessToken);
  }, [state, accessToken, load]);

  useEffect(() => {
    if (state !== "ready" || !accessToken) return;
    if (activeTab !== "webTraffic" && activeTab !== "overview") return;
    void loadWebTraffic(accessToken, webTrafficPreset);
  }, [state, accessToken, activeTab, webTrafficPreset, loadWebTraffic]);

  useEffect(() => {
    if (state !== "ready" || !accessToken) return;
    if (activeTab !== "webTraffic") return;
    void loadWebTrafficUserActivity(accessToken, webTrafficPreset);
  }, [state, accessToken, activeTab, webTrafficPreset, loadWebTrafficUserActivity]);

  const sections = dashboard?.sections || {};
  const sourceErrors = dashboard?.sourceErrors || [];

  const tabPanelIds = useMemo(
    () => ({
      overview: ["overview-funnel", "overview-user-activity", "overview-summary"],
      webTraffic: [],
      accounts: [
        "accounts-totals",
        "accounts-by-date",
        "accounts-by-type",
      ],
      parents: [
        "parents-summary",
        "parents-by-date",
        "parents-onboarding-funnel",
        "parents-activity-metrics",
      ],
      children: [
        "children-join-summary",
        "children-by-date",
        "children-usage-summary",
        "children-by-grade",
      ],
      learning: [
        "learning-summary",
        "learning-by-subject",
        "learning-by-topic",
        "learning-by-grade",
        "learning-daily-accuracy",
        "learning-hard-topics",
        "learning-success-topics",
      ],
      reports: [
        "reports-open-export",
        "reports-truth-check",
        "reports-suspicious-gaps",
      ],
      parentActivities: [
        "parent-activities-summary",
        "parent-activities-by-subject",
        "parent-activities-by-topic",
        "parent-activities-by-grade",
      ],
      teachers: [
        "teachers-summary",
        "teachers-by-date",
        "teachers-activity",
      ],
      books: [
        "books-summary",
        "books-top-pages",
      ],
      rewards: [
        "rewards-summary",
        "rewards-by-day",
        "rewards-by-reason",
      ],
      funnels: ["funnels-all"],
      retention: ["retention-summary"],
      abandonment: ["abandonment-summary"],
      features: [
        "features-summary",
        "features-most-used",
        "features-least-used",
        "features-by-grade",
        "features-by-subject",
      ],
      quality: ["quality-source-errors"],
    }),
    []
  );

  const currentPanelIds = tabPanelIds[activeTab] || [];

  const filterSummary = useMemo(
    () => buildFilterSummary({ preset, from, to, grade, subject, childStatus, dashboard }),
    [preset, from, to, grade, subject, childStatus, dashboard]
  );

  const overviewUserActivitySection = sections.userActivity;

  const overviewMergedFunnel = useMemo(
    () => mergeActivityFunnel(overviewUserActivitySection?.funnel, webTraffic),
    [overviewUserActivitySection?.funnel, webTraffic]
  );

  const handleWebTrafficPresetChange = useCallback(
    (next) => {
      setWebTrafficPreset(next);
      if (accessToken) {
        void loadWebTraffic(accessToken, next);
        void loadWebTrafficUserActivity(accessToken, next);
      }
    },
    [accessToken, loadWebTraffic, loadWebTrafficUserActivity]
  );

  const renderTabContent = () => {
    if (!dashboard) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-2">
            <TabToolbar
              panelIds={currentPanelIds}
              openPanels={openPanels}
              onOpenAll={openAllPanels}
              onCloseAll={closeAllPanels}
            />
            <Panel
              panelId="overview-funnel"
              title="Funnel summary"
              subtitle="Web traffic (Vercel) vs user activity (Supabase)"
              summary={
                overviewMergedFunnel?.steps?.length
                  ? `${overviewMergedFunnel.steps.length} steps`
                  : "No data in this range"
              }
              toggle={togglePanel}
              isOpen={isPanelOpen("overview-funnel")}
            >
              <ActivityFunnelSummary funnel={overviewMergedFunnel} />
            </Panel>
            <Panel
              panelId="overview-user-activity"
              title="User activity — Supabase"
              subtitle="Guests, parents, learning and games (excluding system, QA, and admin accounts)"
              summary={metricsSummary(overviewUserActivitySection?.cards)}
              toggle={togglePanel}
              isOpen={isPanelOpen("overview-user-activity")}
            >
              <MetricGrid items={overviewUserActivitySection?.cards} />
            </Panel>
            <Panel
              panelId="overview-summary"
              title="General summary"
              subtitle="Key feature-usage metrics from existing database sources"
              summary={metricsSummary(sections.overview)}
              toggle={togglePanel}
              isOpen={isPanelOpen("overview-summary")}
            >
              <MetricGrid items={sections.overview} />
            </Panel>
          </div>
        );

      case "webTraffic":
        return (
          <WebTrafficTabContent
            webTrafficPreset={webTrafficPreset}
            onPresetChange={handleWebTrafficPresetChange}
            webTraffic={webTraffic}
            webTrafficLoading={webTrafficLoading}
            webTrafficError={webTrafficError}
            webTrafficUserActivity={webTrafficUserActivity}
            webTrafficUserActivityLoading={webTrafficUserActivityLoading}
            webTrafficUserActivityError={webTrafficUserActivityError}
            publicWorksheetVisits={sections.publicWorksheetVisits}
          />
        );

      case "accounts":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="accounts-totals"
              title="Total accounts"
              subtitle="Auth accounts, personas, roles, and permissions"
              summary={metricsSummary(sections.accounts?.cards)}
              toggle={togglePanel}
              isOpen={isPanelOpen("accounts-totals")}
            >
              <MetricGrid items={sections.accounts?.cards} />
            </Panel>
            <Panel
              panelId="accounts-by-date"
              title="Sign-ups by date"
              summary={rowsSummary(sections.accounts?.joinedByDay)}
              toggle={togglePanel}
              isOpen={isPanelOpen("accounts-by-date")}
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                <TopList title="Label" rows={sections.accounts?.joinedByDay} />
                <TopList title="Label" rows={sections.accounts?.joinedByWeek} />
                <TopList title="Label" rows={sections.accounts?.joinedByMonth} />
              </div>
            </Panel>
            <Panel
              panelId="accounts-by-type"
              title="Accounts by type"
              summary={rowsSummary(sections.accounts?.byPersona)}
              toggle={togglePanel}
              isOpen={isPanelOpen("accounts-by-type")}
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                <TopList title="Label" rows={sections.accounts?.byPersona} />
                <TopList title="Label" rows={sections.accounts?.byAuthRole} />
                <TopList title="Label" rows={sections.accounts?.byStatus} />
              </div>
            </Panel>
          </div>
        );

      case "parents":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="parents-summary"
              title="Summary Parents"
              subtitle="Join dates, children, first learning, and days to feature usage"
              summary={metricsSummary(sections.parentJoin?.cards)}
              toggle={togglePanel}
              isOpen={isPanelOpen("parents-summary")}
            >
              <MetricGrid items={sections.parentJoin?.cards} />
            </Panel>
            <Panel
              panelId="parents-by-date"
              title="Parents by join date"
              summary={rowsSummary(sections.parentJoin?.byDay)}
              toggle={togglePanel}
              isOpen={isPanelOpen("parents-by-date")}
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                <TopList title="Label" rows={sections.parentJoin?.byDay} />
                <TopList title="Label" rows={sections.parentJoin?.byWeek} />
                <TopList title="Label" rows={sections.parentJoin?.byMonth} />
              </div>
            </Panel>
            <Panel
              panelId="parents-onboarding-funnel"
              title="Parent onboarding funnel"
              summary="Path: login → child → learning → report"
              toggle={togglePanel}
              isOpen={isPanelOpen("parents-onboarding-funnel")}
            >
              <FunnelList funnels={sections.parentJoin?.onboardingFunnel ? [sections.parentJoin.onboardingFunnel] : []} />
            </Panel>
            <Panel
              panelId="parents-activity-metrics"
              title="Parent activity"
              subtitle="Creating children, reports, and meaningful feature usage"
              summary={metricsSummary(sections.parents)}
              toggle={togglePanel}
              isOpen={isPanelOpen("parents-activity-metrics")}
            >
              <MetricGrid items={sections.parents} />
            </Panel>
          </div>
        );

      case "children":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="children-join-summary"
              title="Child onboarding"
              subtitle="When children were added and time to first learning"
              summary={metricsSummary(sections.childJoin?.cards)}
              toggle={togglePanel}
              isOpen={isPanelOpen("children-join-summary")}
            >
              <MetricGrid items={sections.childJoin?.cards} />
            </Panel>
            <Panel
              panelId="children-by-date"
              title="Children by add date"
              summary={rowsSummary(sections.childJoin?.byDay)}
              toggle={togglePanel}
              isOpen={isPanelOpen("children-by-date")}
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                <TopList title="Label" rows={sections.childJoin?.byDay} />
                <TopList title="Label" rows={sections.childJoin?.byWeek} />
                <TopList title="Label" rows={sections.childJoin?.byMonth} />
              </div>
            </Panel>
            <Panel
              panelId="children-usage-summary"
              title="Actual feature usage"
              subtitle="Whether children actually learn, not just registered"
              summary={metricsSummary(sections.children?.cards)}
              toggle={togglePanel}
              isOpen={isPanelOpen("children-usage-summary")}
            >
              <MetricGrid items={sections.children?.cards} />
            </Panel>
            <Panel
              panelId="children-by-grade"
              title="Children By grade"
              summary={rowsSummary(sections.children?.byGrade)}
              toggle={togglePanel}
              isOpen={isPanelOpen("children-by-grade")}
            >
              <SimpleTable
                rows={sections.children?.byGrade}
                columns={[
                  { key: "grade", label: "Grade", render: (row) => formatAnalyticsGradeHe(row.grade) },
                  { key: "children", label: "Children" },
                  { key: "activeChildren", label: "Active" },
                  { key: "minutes", label: "Minutes" },
                  { key: "avgMinutes", label: "Avg. minutes" },
                  { key: "answers", label: "Answers" },
                  { key: "accuracy", label: "Accuracy %" },
                ]}
              />
            </Panel>
          </div>
        );

      case "learning":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="learning-summary"
              title="Summary Learning"
              subtitle="Sessions, Minutes, Answers Accuracy"
              summary={metricsSummary(sections.learning?.cards)}
              toggle={togglePanel}
              isOpen={isPanelOpen("learning-summary")}
            >
              <MetricGrid items={sections.learning?.cards} />
            </Panel>
            <Panel
              panelId="learning-by-subject"
              title="Feature usage By subject"
              summary={rowsSummary(sections.learning?.usage?.topSubjects)}
              toggle={togglePanel}
              isOpen={isPanelOpen("learning-by-subject")}
            >
              <TopList rows={sections.learning?.usage?.topSubjects} />
            </Panel>
            <Panel
              panelId="learning-by-topic"
              title="Feature usage By topic"
              summary={rowsSummary(sections.learning?.usage?.topTopics)}
              toggle={togglePanel}
              isOpen={isPanelOpen("learning-by-topic")}
            >
              <TopList rows={sections.learning?.usage?.topTopics} />
            </Panel>
            <Panel
              panelId="learning-by-grade"
              title="Feature usage By grade"
              summary={rowsSummary(sections.learning?.usage?.subjectByGrade)}
              toggle={togglePanel}
              isOpen={isPanelOpen("learning-by-grade")}
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                <TopList title="Subject × grade" rows={sections.learning?.usage?.subjectByGrade} />
                <TopList title="Topic × Grade" rows={sections.learning?.usage?.topicByGrade} />
              </div>
            </Panel>
            <Panel
              panelId="learning-daily-accuracy"
              title="Questions and accuracy by day"
              summary={rowsSummary(sections.learning?.daily)}
              toggle={togglePanel}
              isOpen={isPanelOpen("learning-daily-accuracy")}
            >
              <SimpleTable
                rows={sections.learning?.daily}
                columns={[
                  { key: "date", label: "Date" },
                  { key: "sessions", label: "Sessions" },
                  { key: "minutes", label: "Minutes" },
                  { key: "questions", label: "Questions" },
                  { key: "accuracy", label: "Accuracy %" },
                ]}
              />
            </Panel>
            <Panel
              panelId="learning-hard-topics"
              title="Hard topics"
              summary={rowsSummary(sections.learning?.usage?.highWrongTopics)}
              toggle={togglePanel}
              isOpen={isPanelOpen("learning-hard-topics")}
            >
              <SimpleTable
                rows={sections.learning?.usage?.highWrongTopics}
                columns={[
                  { key: "topic", label: "Topic", render: (row) => formatAnalyticsLabelHe(row.topic) },
                  { key: "answers", label: "Answers" },
                  { key: "wrongRate", label: "Wrong rate %" },
                ]}
              />
            </Panel>
            <Panel
              panelId="learning-success-topics"
              title="Topics with high success"
              summary={rowsSummary(sections.learning?.usage?.highSuccessTopics)}
              toggle={togglePanel}
              isOpen={isPanelOpen("learning-success-topics")}
            >
              <SimpleTable
                rows={sections.learning?.usage?.highSuccessTopics}
                columns={[
                  { key: "topic", label: "Topic", render: (row) => formatAnalyticsLabelHe(row.topic) },
                  { key: "answers", label: "Answers" },
                  { key: "accuracy", label: "Accuracy %" },
                ]}
              />
            </Panel>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="reports-open-export"
              title="Report opens and PDF export"
              summary={metricsSummary(sections.reportTruth?.cards?.slice(0, 4))}
              toggle={togglePanel}
              isOpen={isPanelOpen("reports-open-export")}
            >
              <MetricGrid items={sections.reportTruth?.cards} />
            </Panel>
            <Panel
              panelId="reports-truth-check"
              title="Label"
              subtitle="Compare reports to existing database data"
              summary="Raw source checks"
              toggle={togglePanel}
              isOpen={isPanelOpen("reports-truth-check")}
            >
              <p className="text-xs text-white/55">
                Metrics in "Report opens and PDF export" include comparison against database sources.
              </p>
            </Panel>
            <Panel
              panelId="reports-suspicious-gaps"
              title="Label"
              subtitle="Reports with insufficient data or suspected gaps"
              summary={metricsSummary(sections.reportTruth?.suspicious)}
              toggle={togglePanel}
              isOpen={isPanelOpen("reports-suspicious-gaps")}
            >
              <MetricGrid items={sections.reportTruth?.suspicious} />
            </Panel>
          </div>
        );

      case "parentActivities":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="parent-activities-summary"
              title="Summary Personal activities"
              subtitle="Label"
              summary={metricsSummary(sections.parentActivities?.cards)}
              toggle={togglePanel}
              isOpen={isPanelOpen("parent-activities-summary")}
            >
              <MetricGrid items={sections.parentActivities?.cards} />
            </Panel>
            <Panel
              panelId="parent-activities-by-subject"
              title="By subject"
              summary={rowsSummary(sections.parentActivities?.bySubject)}
              toggle={togglePanel}
              isOpen={isPanelOpen("parent-activities-by-subject")}
            >
              <TopList rows={sections.parentActivities?.bySubject} />
            </Panel>
            <Panel
              panelId="parent-activities-by-topic"
              title="By topic"
              summary={rowsSummary(sections.parentActivities?.byTopic)}
              toggle={togglePanel}
              isOpen={isPanelOpen("parent-activities-by-topic")}
            >
              <TopList rows={sections.parentActivities?.byTopic} />
            </Panel>
            <Panel
              panelId="parent-activities-by-grade"
              title="Label"
              summary={rowsSummary(sections.parentActivities?.byChildGrade)}
              toggle={togglePanel}
              isOpen={isPanelOpen("parent-activities-by-grade")}
            >
              <TopList rows={sections.parentActivities?.byChildGrade} />
            </Panel>
          </div>
        );

      case "teachers":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="teachers-summary"
              title="Summary Private teachers"
              subtitle="Join dates, activity, reports, activities, and worksheets"
              summary={metricsSummary(sections.teachers?.cards)}
              toggle={togglePanel}
              isOpen={isPanelOpen("teachers-summary")}
            >
              <MetricGrid items={sections.teachers?.cards} />
            </Panel>
            <Panel
              panelId="teachers-by-date"
              title="Teachers by join date"
              summary={rowsSummary(sections.teachers?.byDay)}
              toggle={togglePanel}
              isOpen={isPanelOpen("teachers-by-date")}
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                <TopList title="Label" rows={sections.teachers?.byDay} />
                <TopList title="Label" rows={sections.teachers?.byWeek} />
                <TopList title="Label" rows={sections.teachers?.byMonth} />
              </div>
            </Panel>
            <Panel
              panelId="teachers-activity"
              title="Label"
              summary={rowsSummary(sections.teachers?.activityByDay)}
              toggle={togglePanel}
              isOpen={isPanelOpen("teachers-activity")}
            >
              <TopList rows={sections.teachers?.activityByDay} />
            </Panel>
          </div>
        );

      case "books":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="books-summary"
              title="Label"
              subtitle="What is measured today vs what requires event collection"
              summary={metricsSummary(sections.booksAudioWorksheets)}
              toggle={togglePanel}
              isOpen={isPanelOpen("books-summary")}
            >
              <MetricGrid items={sections.booksAudioWorksheets} />
            </Panel>
            <Panel
              panelId="books-top-pages"
              title="Label"
              summary={rowsSummary(sections.topBookPages)}
              toggle={togglePanel}
              isOpen={isPanelOpen("books-top-pages")}
            >
              <TopList rows={sections.topBookPages} />
            </Panel>
          </div>
        );

      case "rewards":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="rewards-summary"
              title="Rewards and coins"
              subtitle="Coin transactions and child balances"
              summary={metricsSummary(sections.rewards)}
              toggle={togglePanel}
              isOpen={isPanelOpen("rewards-summary")}
            >
              <MetricGrid items={sections.rewards} />
            </Panel>
            <Panel
              panelId="rewards-by-day"
              title="Label"
              summary={rowsSummary(sections.rewardsByDay)}
              toggle={togglePanel}
              isOpen={isPanelOpen("rewards-by-day")}
            >
              <TopList rows={sections.rewardsByDay} />
            </Panel>
            <Panel
              panelId="rewards-by-reason"
              title="Label"
              summary={rowsSummary(sections.rewardsByReason)}
              toggle={togglePanel}
              isOpen={isPanelOpen("rewards-by-reason")}
            >
              <TopList rows={sections.rewardsByReason} />
            </Panel>
          </div>
        );

      case "funnels":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="funnels-all"
              title="Usage funnels"
              subtitle="Usage paths: parent, child, reports, activities, books & audio"
              summary={`${(sections.funnels || []).length} funnels`}
              toggle={togglePanel}
              isOpen={isPanelOpen("funnels-all")}
            >
              <FunnelList funnels={sections.funnels} />
            </Panel>
          </div>
        );

      case "retention":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="retention-summary"
              title="Retention"
              subtitle="Label"
              summary={metricsSummary(sections.retention)}
              toggle={togglePanel}
              isOpen={isPanelOpen("retention-summary")}
            >
              <MetricGrid items={sections.retention} />
            </Panel>
          </div>
        );

      case "abandonment":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="abandonment-summary"
              title="Abandonment and abandonment candidates"
              subtitle="Explicit abandonment events and inferred candidates"
              summary={metricsSummary(sections.abandonment)}
              toggle={togglePanel}
              isOpen={isPanelOpen("abandonment-summary")}
            >
              <MetricGrid items={sections.abandonment} />
            </Panel>
          </div>
        );

      case "features":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="features-summary"
              title="Feature usage summary by feature"
              summary={metricsSummary(sections.featureUsage?.cards)}
              toggle={togglePanel}
              isOpen={isPanelOpen("features-summary")}
            >
              <MetricGrid items={sections.featureUsage?.cards} />
            </Panel>
            <Panel
              panelId="features-most-used"
              title="Most used features"
              summary={rowsSummary(sections.featureUsage?.mostUsed)}
              toggle={togglePanel}
              isOpen={isPanelOpen("features-most-used")}
            >
              <TopList rows={sections.featureUsage?.mostUsed} />
            </Panel>
            <Panel
              panelId="features-least-used"
              title="Least used features"
              summary={rowsSummary(sections.featureUsage?.leastUsed)}
              toggle={togglePanel}
              isOpen={isPanelOpen("features-least-used")}
            >
              <TopList rows={sections.featureUsage?.leastUsed} />
            </Panel>
            <Panel
              panelId="features-by-grade"
              title="Feature usage By grade"
              summary={rowsSummary(sections.featureUsage?.byGrade)}
              toggle={togglePanel}
              isOpen={isPanelOpen("features-by-grade")}
            >
              <TopList rows={sections.featureUsage?.byGrade} />
            </Panel>
            <Panel
              panelId="features-by-subject"
              title="Feature usage By subject"
              summary={rowsSummary(sections.featureUsage?.bySubject)}
              toggle={togglePanel}
              isOpen={isPanelOpen("features-by-subject")}
            >
              <TopList rows={sections.featureUsage?.bySubject} />
            </Panel>
          </div>
        );

      case "quality":
        return (
          <div className="space-y-2">
            <TabToolbar panelIds={currentPanelIds} openPanels={openPanels} onOpenAll={openAllPanels} onCloseAll={closeAllPanels} />
            <Panel
              panelId="quality-source-errors"
              title="Missing data sources / quality"
              subtitle="Tables or sources not fully loaded"
              summary={sourceErrors.length ? `${sourceErrors.length} missing sources` : "All sources available"}
              toggle={togglePanel}
              isOpen={isPanelOpen("quality-source-errors")}
            >
              {sourceErrors.length ? (
                <div className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-2 text-xs text-amber-100">
                  Some data sources are missing or unavailable:{" "}
                  {sourceErrors.map((e) => formatAnalyticsTableHe(e.table)).join(", ")}
                </div>
              ) : (
                <p className="text-sm text-emerald-100/80">All primary data sources loaded successfully for the current range.</p>
              )}
            </Panel>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <AdminShell title={ADMIN_ANALYTICS_TITLE} showLogout>
        <div className="space-y-3 max-w-full overflow-x-hidden" dir="rtl" data-analytics-page-root>
          <FilterSummaryBar
            summary={filterSummary}
            open={filtersOpen}
            onToggle={() => setFiltersOpen((prev) => !prev)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <label className="text-xs text-white/70">
                Range
                <select value={preset} onChange={(e) => setPreset(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-white/15 px-2 py-1.5 text-sm text-white">
                  {PRESETS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-white/70">
                From
                <input type="date" value={from} disabled={preset !== "custom"} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-white/15 px-2 py-1.5 text-sm text-white disabled:opacity-50" />
              </label>
              <label className="text-xs text-white/70">
                To
                <input type="date" value={to} disabled={preset !== "custom"} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-white/15 px-2 py-1.5 text-sm text-white disabled:opacity-50" />
              </label>
              <label className="text-xs text-white/70">
                Grade
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-white/15 px-2 py-1.5 text-sm text-white">
                  {GRADES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-white/70">
                Subject
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-white/15 px-2 py-1.5 text-sm text-white">
                  {SUBJECTS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-white/70">
                Child status
                <select value={childStatus} onChange={(e) => setChildStatus(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-white/15 px-2 py-1.5 text-sm text-white">
                  {CHILD_STATUSES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <button
                  type="button"
                  onClick={() => {
                    setFiltersOpen(false);
                    if (accessToken) void load(accessToken);
                  }}
                  className="w-full rounded-lg bg-amber-500/90 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 text-sm"
                >
                  Refresh data
                </button>
              </div>
            </div>
          </FilterSummaryBar>

          {state === "loading" || loading ? (
            <p className="text-white/60 text-sm text-right">{ADMIN_LOADING}</p>
          ) : loadError ? (
            <p className="text-red-300 text-sm text-right">{loadError}</p>
          ) : dashboard ? (
            <>
              {sourceErrors.length ? (
                <div className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-2 text-xs text-amber-100">
                  There are {sourceErrors.length} missing data sources — see the "Truth checks" tab.
                </div>
              ) : null}

              <AnalyticsTabBar activeTab={activeTab} onChange={setActiveTab} />

              <div
                className="rounded-xl border border-white/10 bg-slate-950/40 p-3 w-full max-w-full overflow-x-hidden"
                data-analytics-active-tab={activeTab}
              >
                {renderTabContent()}
              </div>
            </>
          ) : null}
        </div>
      </AdminShell>
    </Layout>
  );
}
