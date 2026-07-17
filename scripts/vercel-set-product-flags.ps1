# Set all LEO-KIDS-GLOBAL product enablement flags on Vercel (names + non-secret values only).
# Usage: .\scripts\vercel-set-product-flags.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$envs = @("production", "preview", "development")

# name -> value (non-secret enablement only)
$flags = [ordered]@{
  "GLOBAL_DATA_WRITES_ENABLED" = "true"
  "GLOBAL_MOCK_MODE" = "false"
  "NEXT_PUBLIC_GLOBAL_MOCK_MODE" = "false"
  "CARD_REWARDS_ENABLED" = "true"
  "NEXT_PUBLIC_CARD_REWARDS_ENABLED" = "true"
  "REWARD_ECONOMY_SETTINGS_ENABLED" = "true"
  "NEXT_PUBLIC_REWARD_ECONOMY_SETTINGS_ENABLED" = "true"
  "ENABLE_SESSION_COIN_AWARDS" = "true"
  "ENABLE_ADMIN_MANUAL_COIN_CREDIT" = "true"
  "NEXT_PUBLIC_ENABLE_ADMIN_MANUAL_COIN_CREDIT" = "true"
  "ENABLE_MONTHLY_PERSISTENCE_REWARD_ADMIN" = "true"
  "ENABLE_MONTHLY_PERSISTENCE_CRON" = "true"
  "NEXT_PUBLIC_ACTIVITIES_ENABLED" = "true"
  "NEXT_PUBLIC_LEARNING_BOOK_AUDIO_ENABLED" = "true"
  "LEARNING_BOOK_AUDIO_ENABLED" = "true"
  "NEXT_PUBLIC_MATH_SCRATCHPAD_V1" = "true"
  "NEXT_PUBLIC_LEARNING_TIME_FAIRNESS_V1" = "true"
  "NEXT_PUBLIC_ENABLE_ADAPTIVE_PLANNER_RECOMMENDATION" = "true"
  "ENABLE_ADAPTIVE_PLANNER_RECOMMENDATION" = "true"
  "NEXT_PUBLIC_ENABLE_ADAPTIVE_PLANNER_AI_EXPLAINER" = "true"
  "ENABLE_ADAPTIVE_PLANNER_AI_EXPLAINER" = "true"
  "DIAGNOSTIC_METADATA_SUBSKILL_ENABLED" = "true"
  "DIAGNOSTIC_METADATA_PARENT_GATING_ENABLED" = "true"
  "DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED" = "true"
  "NEXT_PUBLIC_ENABLE_PARENT_COPILOT_ON_SHORT" = "true"
  "NEXT_PUBLIC_PARENT_COPILOT_V1" = "1"
  "PARENT_COPILOT_LLM_ENABLED" = "true"
  "PARENT_COPILOT_LLM_EXPERIMENT" = "true"
  "PARENT_COPILOT_FORCE_DETERMINISTIC" = "false"
  "PARENT_COPILOT_ROLLOUT_STAGE" = "full"
  "PARENT_REPORT_NARRATIVE_LLM_ENABLED" = "true"
  "PARENT_REPORT_NARRATIVE_FORCE_DETERMINISTIC" = "false"
  "ARCADE_ALLOW_FOUNDATION_ACTIONS" = "true"
  "TEACHER_PORTAL_ENABLED" = "true"
  "TEACHER_PORTAL_LINK_ENABLED" = "true"
  "TEACHER_PORTAL_INVITE_ONLY" = "false"
  "GUARDIAN_PORTAL_ENABLED" = "true"
  "NEXT_PUBLIC_STUDENT_AD_EXTERNAL_ENABLED" = "true"
  "NEXT_PUBLIC_ENABLE_ENGINE_REVIEW_ADMIN" = "true"
  "ADMIN_FULL_ACCOUNT_DELETE_ENABLED" = "true"
  "NEXT_PUBLIC_AI_HYBRID_ROLLOUT" = "live"
  "NEXT_PUBLIC_HELP_CENTER_ALLOW_MISSING_SCREENSHOTS" = "1"
  "HELP_CENTER_ALLOW_MISSING_SCREENSHOTS" = "1"
  "NEXT_PUBLIC_CONTACT_FORM_ENABLED" = "true"
}

foreach ($name in $flags.Keys) {
  $value = $flags[$name]
  foreach ($envName in $envs) {
    Write-Host "Setting $name=$value on $envName ..."
    vercel env rm $name $envName --yes 2>$null | Out-Null
    $value | vercel env add $name $envName --force 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
      Write-Warning "Failed to set $name on $envName (exit $LASTEXITCODE)"
    }
  }
}

Write-Host "Done. Run: vercel env ls"
