import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import TeacherPortalShell from "../../../components/teacher-portal/TeacherPortalShell";
import SchoolStaffChangePinForm from "../../../components/school-portal/SchoolStaffChangePinForm";
import { useI18n } from "../../../lib/i18n/I18nProvider.jsx";
import { bindSchoolUiLocale, SCHOOL_STAFF_CHANGE_PIN_TITLE } from "../../../lib/school-portal/school-ui.js";

export default function SchoolStaffChangePinPage() {
  const router = useRouter();
  const { locale } = useI18n();
  bindSchoolUiLocale(locale);

  return (
    <Layout>
      <TeacherPortalShell title={SCHOOL_STAFF_CHANGE_PIN_TITLE}>
        <div data-testid="school-staff-change-pin-root">
          <SchoolStaffChangePinForm
            onSuccess={(redirectPath) => {
              router.replace(redirectPath || "/teacher/dashboard");
            }}
          />
        </div>
      </TeacherPortalShell>
    </Layout>
  );
}
