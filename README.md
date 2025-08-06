# 한국 주식 시장 하락률 분석 도구 📈

코스피(KOSPI)와 코스닥(KOSDAQ) 종목의 하락률 통계를 분석하고 시각화하는 Python 도구입니다.

## 🚀 주요 기능

- **종목 데이터 수집**: 코스피, 코스닥 전체 종목 리스트 자동 수집
- **하락률 분석**: 지정된 기간 동안의 최대 하락률 계산
- **통계 분석**: 평균, 중앙값, 표준편차, 구간별 분포 등 상세 통계
- **데이터 시각화**: 인터랙티브 차트와 그래프 생성
- **리포트 생성**: HTML 및 Excel 형태의 분석 리포트
- **시장별 비교**: KOSPI vs KOSDAQ 성과 비교

## 📦 설치 및 설정

### 1. 필요한 패키지 설치

```bash
pip install -r requirements.txt
```

### 2. 필요한 Python 패키지 목록

- `yfinance`: Yahoo Finance 데이터 수집
- `FinanceDataReader`: 한국 주식 데이터 수집
- `pandas`: 데이터 처리 및 분석
- `plotly`: 인터랙티브 시각화
- `openpyxl`: Excel 파일 생성

## 🔧 사용 방법

### 간편 실행 (추천)

```bash
python run_analysis.py
```

대화형 메뉴를 통해 설정을 쉽게 변경하고 분석을 실행할 수 있습니다.

### 고급 사용법

```bash
python korean_stock_analysis.py
```

스크립트를 직접 실행하거나 `config.py`에서 설정을 수정한 후 실행합니다.

### 프로그래밍 방식 사용

```python
from korean_stock_analysis import KoreanStockAnalyzer

# 분석기 초기화
analyzer = KoreanStockAnalyzer()

# 종목 리스트 수집
analyzer.get_stock_list()

# 하락률 분석 (코스피+코스닥, 30일, 100개 종목)
df_results, stats = analyzer.analyze_market_decline(
    market='both', 
    period_days=30, 
    sample_size=100
)

# 시각화 생성
fig = analyzer.create_visualizations(df_results, stats)
fig.show()
```

## ⚙️ 설정 옵션

`config.py` 파일에서 다음 설정을 변경할 수 있습니다:

```python
ANALYSIS_CONFIG = {
    'market': 'both',           # 분석 시장: 'kospi', 'kosdaq', 'both'
    'period_days': 30,          # 분석 기간 (일)
    'sample_size': 100,         # 분석할 종목 수
    'data_period': '1y',        # 데이터 수집 기간
}
```

### 시장 옵션
- `'kospi'`: 코스피 종목만 분석
- `'kosdaq'`: 코스닥 종목만 분석  
- `'both'`: 코스피 + 코스닥 모두 분석

### 분석 기간 옵션
- `7`: 최근 1주일
- `30`: 최근 1개월 (기본값)
- `90`: 최근 3개월
- `180`: 최근 6개월

## 📊 출력 결과

분석 완료 후 다음 파일들이 생성됩니다:

### 1. HTML 리포트 (`korean_stock_decline_report.html`)
- 주요 통계 요약
- 하락률 구간별 분포표
- 상위 하락 종목 리스트
- 깔끔한 웹 형태의 리포트

### 2. 인터랙티브 시각화 (`korean_stock_decline_visualization.html`)
- 하락률 분포 히스토그램
- 시장별 박스플롯 비교
- 구간별 종목 수 막대그래프
- 상위 하락 종목 차트

### 3. Excel 데이터 (`korean_stock_decline_analysis.xlsx`)
- **전체_데이터**: 모든 분석 결과
- **통계_요약**: 핵심 통계 지표
- **상위_하락_종목**: 하락률 상위 50개 종목
- **KOSPI/KOSDAQ**: 시장별 세부 데이터

## 📈 분석 지표 설명

### 하락률 계산 방식
```
최대 하락률 = ((최저가 - 최고가) / 최고가) × 100
```

### 주요 통계 지표
- **평균 하락률**: 전체 종목의 하락률 평균
- **중앙값 하락률**: 하락률의 중앙값 (이상치 영향 최소화)
- **표준편차**: 하락률의 변동성 측정
- **최대/최소 하락률**: 가장 큰/작은 하락률

### 하락률 구간 분류
- `-30% 이상`: 극심한 하락
- `-20~-30%`: 심각한 하락
- `-10~-20%`: 상당한 하락
- `-5~-10%`: 보통 하락
- `-5~0%`: 경미한 하락
- `0~10%`: 상승
- `10% 이상`: 큰 상승

## 🔍 사용 예시

### 예시 1: 코스피만 최근 1주일 분석
```python
# config.py에서 설정 변경
ANALYSIS_CONFIG['market'] = 'kospi'
ANALYSIS_CONFIG['period_days'] = 7
ANALYSIS_CONFIG['sample_size'] = 50
```

### 예시 2: 코스닥 대형주 3개월 분석
```python
analyzer = KoreanStockAnalyzer()
analyzer.get_stock_list()

# 시가총액 기준 상위 종목 분석 (별도 필터링 필요)
df_results, stats = analyzer.analyze_market_decline(
    market='kosdaq', 
    period_days=90, 
    sample_size=30
)
```

## ⚠️ 주의사항

1. **네트워크 연결**: 인터넷 연결이 필요합니다 (데이터 수집용)
2. **실행 시간**: 종목 수가 많을수록 실행 시간이 길어집니다
3. **데이터 제약**: 일부 종목은 데이터가 없을 수 있습니다
4. **API 제한**: 과도한 요청 시 API 제한이 있을 수 있습니다

## 🛠️ 문제 해결

### 일반적인 오류 및 해결책

1. **종목 리스트 수집 실패**
   ```
   pip install --upgrade FinanceDataReader
   ```

2. **패키지 설치 오류**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt --force-reinstall
   ```

3. **데이터 수집 실패**
   - 인터넷 연결 확인
   - 샘플 크기 줄이기
   - 재시도 (일시적 네트워크 오류 가능)

## 📝 추가 개발 아이디어

- [ ] 섹터별 하락률 분석
- [ ] 시가총액별 분석
- [ ] 거래량과 하락률 상관관계 분석
- [ ] 실시간 모니터링 기능
- [ ] 알림 기능 (특정 하락률 이상 시)
- [ ] 백테스팅 기능

## 📧 연락처 및 지원

이 도구에 대한 문의사항이나 개선 제안이 있으시면 언제든 연락주세요.

---

**면책조항**: 이 도구는 교육 및 분석 목적으로만 사용되어야 하며, 투자 결정의 유일한 근거로 사용해서는 안 됩니다. 투자에는 위험이 따르므로 신중한 판단이 필요합니다.