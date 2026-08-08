/**
 * Phase 9B-5: add reconciled Parent + Student stable codes into EN + id-ID validation.api.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

/** @type {Record<string, { en: string, id: string }>} */
const NEW = {
  // Parent (27)
  username_taken: {
    en: "Username is already taken.",
    id: "Nama pengguna sudah digunakan.",
  },
  invalid_pin: {
    en: "Enter a valid 4-digit PIN.",
    id: "Masukkan PIN 4 digit yang valid.",
  },
  invalid_username: {
    en: "Invalid username.",
    id: "Nama pengguna tidak valid.",
  },
  access_code_create_failed: {
    en: "Could not create access code.",
    id: "Tidak dapat membuat kode akses.",
  },
  username_check_failed: {
    en: "Could not verify username availability.",
    id: "Tidak dapat memeriksa ketersediaan nama pengguna.",
  },
  access_code_revoke_failed: {
    en: "Could not revoke the previous access code.",
    id: "Tidak dapat mencabut kode akses sebelumnya.",
  },
  student_inactive: {
    en: "This child account is not active.",
    id: "Akun anak ini tidak aktif.",
  },
  create_student_failed: {
    en: "Could not create student.",
    id: "Tidak dapat menambahkan murid.",
  },
  load_created_student_failed: {
    en: "Could not load the created student.",
    id: "Tidak dapat memuat murid yang baru dibuat.",
  },
  child_limit_reached: {
    en: "You have reached the child limit for this parent account.",
    id: "Anda telah mencapai batas jumlah anak untuk akun orang tua ini.",
  },
  full_name_required: {
    en: "Full name is required.",
    id: "Nama lengkap wajib diisi.",
  },
  full_name_too_long: {
    en: "Full name is too long.",
    id: "Nama lengkap terlalu panjang.",
  },
  grade_level_too_long: {
    en: "Grade value is too long.",
    id: "Nilai Kelas terlalu panjang.",
  },
  update_student_failed: {
    en: "Could not update student.",
    id: "Tidak dapat memperbarui data murid.",
  },
  update_student_grade_failed: {
    en: "Could not update student grade.",
    id: "Tidak dapat memperbarui Kelas murid.",
  },
  no_fields_to_update: {
    en: "No fields to update.",
    id: "Tidak ada data untuk diperbarui.",
  },
  guest_link_failed: {
    en: "Unable to link this guest number. Check the number and try again.",
    id: "Tidak dapat menautkan nomor tamu ini. Periksa nomornya dan coba lagi.",
  },
  invalid_leo_number: {
    en: "Enter a valid Leo guest number.",
    id: "Masukkan nomor Leo tamu yang valid.",
  },
  invalid_subject: {
    en: "Invalid subject.",
    id: "Mata pelajaran tidak valid.",
  },
  no_valid_fields: {
    en: "No valid fields to update.",
    id: "Tidak ada bidang valid untuk diperbarui.",
  },
  subject_catalog_incomplete: {
    en: "The subject catalog is incomplete.",
    id: "Katalog mata pelajaran belum lengkap.",
  },
  coin_history_load_failed: {
    en: "Failed to load coin history.",
    id: "Gagal memuat riwayat koin.",
  },
  delete_student_failed: {
    en: "Delete failed. Please try again.",
    id: "Penghapusan gagal. Silakan coba lagi.",
  },
  delete_student_timeout: {
    en: "Deleting the child timed out. Please try again.",
    id: "Penghapusan anak kehabisan waktu. Silakan coba lagi.",
  },
  delete_student_dependency_failed: {
    en: "Could not delete related child data.",
    id: "Tidak dapat menghapus data terkait anak.",
  },
  delete_student_fk_blocked: {
    en: "A database dependency prevents deletion.",
    id: "Ketergantungan basis data mencegah penghapusan.",
  },
  student_not_owned: {
    en: "You cannot delete this child or permission was denied.",
    id: "Anda tidak dapat menghapus anak ini atau izin ditolak.",
  },

  // Student / Arcade (12)
  invalid_game: {
    en: "That game is not available.",
    id: "Gim itu belum tersedia.",
  },
  invalid_difficulty: {
    en: "That difficulty level is not valid.",
    id: "Tingkat kesulitan itu tidak valid.",
  },
  invalid_game_category: {
    en: "This game is not in the educational category.",
    id: "Gim ini bukan gim edukatif.",
  },
  invalid_game_data: {
    en: "Game data is invalid.",
    id: "Data gim tidak valid.",
  },
  missing_game_id: {
    en: "Game session ID is missing.",
    id: "ID sesi gim hilang.",
  },
  game_session_mismatch: {
    en: "Game does not match this session.",
    id: "Gim tidak cocok dengan sesi ini.",
  },
  invalid_category: {
    en: "Invalid game category.",
    id: "Kategori gim tidak valid.",
  },
  start_failed: {
    en: "Could not start the game.",
    id: "Tidak bisa memulai gim.",
  },
  finish_failed: {
    en: "Could not finish the game.",
    id: "Tidak bisa menyelesaikan gim.",
  },
  guest_resume_failed: {
    en: "Could not resume guest on this device.",
    id: "Tidak bisa melanjutkan mode tamu di perangkat ini.",
  },
  invalid_credentials: {
    en: "Incorrect username or PIN.",
    id: "Nama pengguna atau kode masuk salah.",
  },
  session_expired: {
    en: "Your session expired — please sign in again.",
    id: "Sesi kamu berakhir — silakan masuk lagi.",
  },
};

function patch(file, lang) {
  const abs = path.join(ROOT, file);
  const json = JSON.parse(fs.readFileSync(abs, "utf8"));
  if (!json.api || typeof json.api !== "object") throw new Error(`no api in ${file}`);
  let added = 0;
  for (const [code, copies] of Object.entries(NEW)) {
    if (json.api[code] != null) continue;
    json.api[code] = copies[lang];
    added += 1;
  }
  // Keep stable key order: sort api keys
  const sorted = {};
  for (const k of Object.keys(json.api).sort()) sorted[k] = json.api[k];
  json.api = sorted;
  fs.writeFileSync(abs, `${JSON.stringify(json, null, 2)}\n`);
  return { file, added, total: Object.keys(json.api).length };
}

const en = patch("locales/en/validation.json", "en");
const id = patch("locales/id-ID/validation.json", "id");
console.log(JSON.stringify({ en, id, newCodes: Object.keys(NEW).length }, null, 2));
