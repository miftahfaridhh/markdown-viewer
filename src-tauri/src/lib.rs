mod commands;

use commands::{get_file_modified_time, get_home_dir, list_directory, read_markdown_file};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            read_markdown_file,
            list_directory,
            get_home_dir,
            get_file_modified_time,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
