# public-showcase-hygiene Specification

## Purpose
確保專案中任何將公開發佈的原始碼、文件與建置產物都不含可回溯原客戶的識別資訊，並以可重複執行的檢查持續把關。

## Requirements

### Requirement: 公開內容不含識別資訊
版控追蹤的所有檔案 SHALL NOT 含有原品牌名、原客戶企業名稱、原 email 網域、原業務術語、Figma 檔案位址或 fileKey。

#### Scenario: 全庫搜尋無命中
- **WHEN** 以禁用詞清單逐項搜尋所有版控追蹤檔案
- **THEN** 命中數為 0

#### Scenario: 假資料 email 使用保留網域
- **WHEN** 任一頁面顯示使用者 email
- **THEN** 網域為 `example.com`

### Requirement: 禁用詞清單不進版控
禁用詞清單 SHALL 存放於版控忽略的檔案或部署平台的機密設定，且 SHALL NOT 出現在任何版控追蹤檔案中。

#### Scenario: 清單檔被忽略
- **WHEN** 檢查版控狀態
- **THEN** 禁用詞清單檔不在追蹤或待提交清單中

### Requirement: 自動化識別資訊檢查
系統 SHALL 提供 `lint:brand` 指令，可指定掃描目錄；任一禁用詞命中時 SHALL 以非零狀態結束並列出檔案與行號。

#### Scenario: 命中時失敗
- **WHEN** 被掃描檔案含有禁用詞
- **THEN** 指令以非零狀態結束並輸出命中位置

#### Scenario: 乾淨時通過
- **WHEN** 被掃描檔案皆無禁用詞
- **THEN** 指令以零狀態結束

#### Scenario: 缺少清單時拒絕放行
- **WHEN** 找不到禁用詞清單
- **THEN** 指令以非零狀態結束，不得視為通過

### Requirement: 去識別化不改變行為
替換後所有頁面與元件的互動行為 SHALL 與替換前一致。

#### Scenario: 字串比對邏輯同步
- **WHEN** 在報表頁切換下拉選項、展開收合與開啟匯出對話框
- **THEN** 行為與替換前相同，主控台無錯誤
