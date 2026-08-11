# Design QA

## Comparison target

- Source visual truth: `C:\Users\xiaoyao.li\.codex\generated_images\019feb98-72d7-7781-8d3f-3e5c55e055ab\exec-0a0bbfb1-c214-4cfe-b921-0362ecf89a0c.png`
- Browser implementation: `_work/render/pool-desktop-final.png`
- Full-view side-by-side evidence: `_work/render/design-comparison.png`
- Viewport: 1440 × 1024 CSS px, desktop, light theme, post-import search state.
- Density normalization: source and browser capture were each resized to 1200 px wide only for the comparison board; no device frame or browser chrome is included.

## Findings

No actionable P0, P1, or P2 differences.

- Fonts and typography: implementation preserves the reference's strong Chinese title/search hierarchy, compact table labels, and legible 12–17 px operational text. Local fallbacks preserve readability if the web font is unavailable.
- Spacing and layout rhythm: header, import confirmation, full-width search field, explanatory row, and sparse table hierarchy follow the selected direction. The implementation intentionally uses one imported item rather than the reference's static multi-row catalog.
- Colors and visual tokens: pale cool-gray canvas, white surfaces, restrained violet interaction color, green import-success state, and fine gray dividers are consistent with the target.
- Image quality and asset fidelity: brand and product assets are real image files; the browser proof confirms the spreadsheet's embedded image is extracted as an in-memory image data URL.
- Copy and content: the implementation replaces generic mock copy with the agreed local-PoC boundary, file behavior, and explainable match labels.

## Focused checks

- Upload / import confirmation: template upload produced one real product with one embedded picture; the success strip correctly reports both counts.
- Search behavior: `neiliujiao` returned the item as `谐音 / 拼音召回`; an edit-distance test returned `错别字容错`; `找下不锈钢六角紧固件` returned `语义关联`.
- Interaction and accessibility: file chooser, search clearing, template download link, responsive table, detail dialog, close control, focusable upload zone, and visible controls were exercised.
- Responsive evidence: `_work/render/home-mobile.png` at 390 × 844 has no horizontal overflow (`scrollWidth 375`, `innerWidth 390`).
- Console: no warning or error entries after import and search.

## Comparison history

1. The first visual pass exposed a compacted wordmark in the header. Replaced it with the supplied icon asset and recaptured `_work/render/pool-desktop-final.png`.
2. Recompared the corrected capture with the source board. No P0/P1/P2 issues remain.

## Follow-up polish

- P3: When a customer supplies more than a few hundred rows, add local pagination/virtualization while retaining the current search result hierarchy.

final result: passed

## 2026-08-11 通用检索升级复核

- 实施状态：通过。新增的“模糊推荐”提示位于结果表上方，采用低置信度黄色，而强匹配继续保持原有紫色/绿色层级，未将推荐结果伪装成准确命中。
- 浏览器实测：导入 `_work/test-data/通用材料检索验证.xlsx` 后，`festo snc` 命中第一条 Festo 材料；`真空发生器` 命中 `适用设备` 附加列；完全无关词显示 5 条低置信度推荐。
- 视觉证据：`_work/render/universal-search-fallback.png`。页面在原结果表结构内完成状态扩展，无横向溢出；控制台无错误。

final result: passed
