# Spec Delta

## Purpose

讓開發者與 AI 以單一指令取得展示網站每個畫面的截圖與錯誤報告，於修改後自我驗證畫面，而不依賴人工開瀏覽器逐頁檢查。

## ADDED Requirements

### Requirement: 單一指令截圖全部畫面
系統 SHALL 提供一個指令，依展示網站的 story 清單逐一截圖，輸出至固定資料夾，檔名可對應 story。

#### Scenario: 截全部
- **WHEN** 執行截圖指令且未指定篩選
- **THEN** 每個 story 各產生一張截圖，數量與 story 清單一致

#### Scenario: 篩選部分
- **WHEN** 執行截圖指令並指定篩選字串
- **THEN** 只截 id 含該字串的 story

### Requirement: 錯誤報告
截圖指令 SHALL 輸出報告，逐一列出每個畫面的主控台錯誤、未捕捉例外與載入失敗（HTTP 狀態 400 以上或網路失敗）的資源；任一畫面有錯誤時 SHALL 以非零狀態結束。

#### Scenario: 資源 404
- **WHEN** 某畫面載入的樣式或腳本回應 404
- **THEN** 報告列出該畫面與資源網址，指令以非零狀態結束

#### Scenario: 全部正常
- **WHEN** 所有畫面無錯誤
- **THEN** 報告顯示全部通過，指令以零狀態結束

### Requirement: 模擬部署路徑
截圖 SHALL 在與正式部署相同的子路徑下進行，以捕捉路徑相關錯誤。

#### Scenario: 子路徑
- **WHEN** 執行截圖指令
- **THEN** 頁面以子路徑（非網站根目錄）載入

### Requirement: 執行後不殘留程序
截圖指令結束時（含失敗與中斷）SHALL 關閉其啟動的伺服器與瀏覽器。

#### Scenario: 結束
- **WHEN** 截圖指令結束
- **THEN** 不留下其啟動的背景程序
