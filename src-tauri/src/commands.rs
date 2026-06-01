use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::time::UNIX_EPOCH;

#[derive(Serialize, Deserialize, Debug)]
pub struct FileContent {
    pub content: String,
    pub size_bytes: u64,
    pub path: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub children: Option<Vec<FileEntry>>,
}


#[tauri::command]
pub fn read_markdown_file(path: String) -> Result<FileContent, String> {
    let p = Path::new(&path);

    let ext = p.extension().and_then(|e| e.to_str()).unwrap_or("");
    if ext != "md" && ext != "markdown" {
        return Err("Only .md and .markdown files are supported".to_string());
    }

    let metadata = fs::metadata(p).map_err(|e| e.to_string())?;
    let content = fs::read_to_string(p).map_err(|e| e.to_string())?;

    Ok(FileContent {
        content,
        size_bytes: metadata.len(),
        path,
    })
}

#[tauri::command]
pub fn list_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let p = Path::new(&path);
    if !p.is_dir() {
        return Err(format!("{} is not a directory", path));
    }
    read_dir_recursive(p, 0)
}

fn read_dir_recursive(dir: &Path, depth: u32) -> Result<Vec<FileEntry>, String> {
    if depth > 4 {
        return Ok(vec![]);
    }

    let mut entries: Vec<FileEntry> = fs::read_dir(dir)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let meta = entry.metadata().ok()?;
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();

            if name.starts_with('.') {
                return None;
            }

            if meta.is_dir() {
                let children = read_dir_recursive(&path, depth + 1).ok()?;
                Some(FileEntry {
                    name,
                    path: path.to_string_lossy().to_string(),
                    is_dir: true,
                    children: Some(children),
                })
            } else {
                let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");
                if ext == "md" || ext == "markdown" {
                    Some(FileEntry {
                        name,
                        path: path.to_string_lossy().to_string(),
                        is_dir: false,
                        children: None,
                    })
                } else {
                    None
                }
            }
        })
        .collect();

    entries.sort_by(|a, b| match (a.is_dir, b.is_dir) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(entries)
}

#[tauri::command]
pub fn get_home_dir() -> Result<String, String> {
    dirs_path()
}

fn dirs_path() -> Result<String, String> {
    std::env::var("USERPROFILE")
        .or_else(|_| std::env::var("HOME"))
        .map_err(|_| "Cannot determine home directory".to_string())
}

#[tauri::command]
pub fn get_file_modified_time(path: String) -> Result<u64, String> {
    let meta = fs::metadata(&path).map_err(|e| e.to_string())?;
    let modified = meta.modified().map_err(|e| e.to_string())?;
    Ok(modified
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs())
}
