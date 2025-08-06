# 📊 블로그 검색어 추이 분석

GIROK labs에서 개발한 블로그 검색어 동향 분석 도구입니다. 네이버 블로그 검색 API와 Google Trends를 활용하여 특정 키워드의 검색 추이를 분석할 수 있습니다.

## 🌟 주요 기능

- **네이버 블로그 검색 추이**: 네이버 블로그에서 특정 키워드의 일별 검색 결과 수 추적
- **Google Trends 분석**: 구글 트렌드를 통한 검색어 인기도 추이 확인
- **수동 키워드 추적**: 관심 있는 키워드를 로컬 스토리지에 저장하여 지속 추적
- **시각적 대시보드**: 직관적인 웹 인터페이스로 데이터 확인

## 🚀 빠른 시작

### 1. 프론트엔드 실행

웹 브라우저에서 `index.html` 파일을 열거나 로컬 서버를 실행하세요:

```bash
# 간단한 HTTP 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js가 있다면
npx serve .
```

그 후 브라우저에서 `http://localhost:8000/blog-trends.html`에 접속하세요.

### 2. 백엔드 API 설정 (선택사항)

실제 API 연동을 원한다면 Python 백엔드를 설정하세요:

```bash
# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
export NAVER_CLIENT_ID='your_naver_client_id'
export NAVER_CLIENT_SECRET='your_naver_client_secret'

# API 서버 실행
python blog-trends-api.py
```

## 🔧 API 설정

### 네이버 개발자 센터 설정

1. [네이버 개발자 센터](https://developers.naver.com/) 방문
2. 애플리케이션 등록
3. 검색 API 서비스 추가
4. Client ID와 Client Secret 발급
5. 환경변수로 설정

### Google Trends 설정

Google Trends는 `pytrends` 라이브러리를 통해 무료로 사용할 수 있습니다. 별도 API 키는 필요하지 않습니다.

## 📋 API 엔드포인트

### POST `/api/naver-blog-trends`
네이버 블로그 검색어 추이 분석

**요청 본문:**
```json
{
  "keyword": "콜레스테롤 관리",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "sort": "sim"
}
```

### POST `/api/google-trends`
Google Trends 데이터 조회

**요청 본문:**
```json
{
  "keyword": "cholesterol management",
  "timeframe": "today 1-m",
  "geo": "KR"
}
```

### POST `/api/combined-analysis`
네이버 블로그 + Google Trends 통합 분석

**요청 본문:**
```json
{
  "keyword": "건강관리"
}
```

### GET `/api/health`
API 서버 상태 확인

## 🎯 사용 예시

### 1. 웹 인터페이스 사용

1. `blog-trends.html` 페이지 접속
2. 원하는 탭 선택 (네이버 블로그 / Google Trends / 수동 추적)
3. 검색 키워드 입력
4. 결과 확인

### 2. API 직접 호출

```bash
# 네이버 블로그 검색어 추이
curl -X POST http://localhost:5000/api/naver-blog-trends \
  -H "Content-Type: application/json" \
  -d '{"keyword":"콜레스테롤"}'

# Google Trends 분석
curl -X POST http://localhost:5000/api/google-trends \
  -H "Content-Type: application/json" \
  -d '{"keyword":"cholesterol"}'
```

## 📊 분석 결과 예시

### 네이버 블로그 검색 추이
```json
{
  "keyword": "콜레스테롤 관리",
  "period": "2024-01-01 ~ 2024-01-31",
  "daily_trends": [
    {"date": "2024-01-01", "count": 1234},
    {"date": "2024-01-02", "count": 1456}
  ],
  "summary": {
    "total_count": 38970,
    "average_count": 1257.42,
    "trend_percentage": 15.3,
    "trend_direction": "increasing"
  }
}
```

## 🔍 추가 분석 방법

### 1. 키워드 트렌드 비교
여러 키워드를 동시에 분석하여 상대적 인기도 비교

### 2. 계절성 분석
장기간 데이터를 통한 계절별 검색 패턴 분석

### 3. 경쟁 키워드 발굴
관련 검색어를 통한 새로운 키워드 기회 발견

## 🛠️ 커스터마이징

### 새로운 검색 엔진 추가
`BlogTrendsAnalyzer` 클래스에 새로운 메소드를 추가하여 다른 검색 엔진의 API를 연동할 수 있습니다.

### 데이터 저장
검색 결과를 데이터베이스에 저장하여 히스토리 추적 기능을 추가할 수 있습니다.

### 알림 기능
특정 키워드가 급상승할 때 이메일이나 슬랙 알림을 보내는 기능을 추가할 수 있습니다.

## 📞 지원

문의사항이나 버그 리포트는 다음으로 연락해주세요:
- 이메일: greego86@gmail.com
- GitHub: [giroklabs](https://github.com/giroklabs)

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

---

**GIROK labs** - 기록을 통해 더 나은 삶을 만드는 연구소