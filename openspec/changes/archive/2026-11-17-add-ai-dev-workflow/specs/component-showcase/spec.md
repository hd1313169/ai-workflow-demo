# Spec Delta

## ADDED Requirements

### Requirement: 元件全收錄
展示網站 SHALL 收錄專案註冊的所有 `fb-*` 元件；每個元件 SHALL 有可互動範例與完整屬性表（說明、預設值、分組）。

#### Scenario: 比對元件清單
- **WHEN** 比對元件程式註冊的元件名稱與展示網站的 Components 區
- **THEN** 每個註冊的元件皆有對應項目

#### Scenario: 需觸發的元件
- **WHEN** 訪客檢視對話框類元件
- **THEN** 頁面提供觸發按鈕，開啟後可關閉，並顯示事件結果
