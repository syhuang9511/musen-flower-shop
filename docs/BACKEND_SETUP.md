# 後端啟動指南（MySQL 版）

後端為 Spring Boot 3 + JPA + Flyway，資料庫使用 **MySQL 8**。
前端（Vue）與後端（Spring Boot）為前後端分離，各自啟動、以 REST API 溝通。

需求：**JDK 17**、**MySQL 8**、以及 **Maven**（或用 Docker 跳過 MySQL 安裝）。

---

## 一、安裝 JDK 17

```powershell
winget install --id Microsoft.OpenJDK.17 -e
```
> 安裝時會跳出「以系統管理員執行」(UAC) 視窗，請按**是**。
> 裝完**關掉並重開終端機**，確認：`java -version` 顯示 17。

---

## 二、準備資料庫（二選一）

### 方式 A：用 Docker（推薦，免手動設定）
裝好 Docker Desktop 後，在專案根目錄：
```powershell
docker compose up -d
```
這會自動建立資料庫 `floralshop`、帳號 `floral` / 密碼 `floral`（與 `application.yml` 一致），
並附帶 Adminer（資料庫網頁管理）在 http://localhost:8080。

### 方式 B：本機安裝 MySQL
```powershell
winget install --id Oracle.MySQL -e
```
安裝精靈會請你設定 **root 密碼**並啟動服務。完成後用 root 登入建立資料庫與帳號：
```sql
CREATE DATABASE floralshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'floral'@'localhost' IDENTIFIED BY 'floral';
GRANT ALL PRIVILEGES ON floralshop.* TO 'floral'@'localhost';
FLUSH PRIVILEGES;
```
> 表格與種子資料**不用手動建**，Flyway 會在後端啟動時自動跑 `V1`、`V2`。

---

## 三、啟動後端

需要 Maven。若尚未安裝，兩個選擇：
- 安裝 Maven：下載 https://maven.apache.org/download.cgi 解壓後把 `bin` 加進 PATH，
  或請 Claude 幫你把 **Maven Wrapper**（`mvnw`）加進專案，這樣只要有 JDK 就能跑。

啟動：
```powershell
cd backend
mvn spring-boot:run        # 或 ./mvnw spring-boot:run（若已加 wrapper）
```
成功後 API 在 http://localhost:8081 。

---

## 四、讓前端連後端

前端目前多數資料以 LocalStorage 模擬。要改用真後端 API，需在前端 `.env.local`
設定 API base URL（指向 http://localhost:8081 ），並把對應的 store 由 LocalStorage 改為呼叫 `api/modules.js`。
此步驟可請 Claude 協助逐一接上。

---

## 預設帳號

- 後台管理員（前端 Demo 登入）：`yun`(小花) / `admin`(大明)，密碼皆 `1234`
- 後端種子管理員：`admin@floralshop.test`（見 `V2__seed_data.sql`）
