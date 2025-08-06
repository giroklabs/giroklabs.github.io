# -*- coding: utf-8 -*-
"""
Korean Stock Analysis Configuration
코스피, 코스닥 분석 설정 파일
"""

# 분석 설정
ANALYSIS_CONFIG = {
    # 분석할 시장 ('kospi', 'kosdaq', 'both')
    'market': 'both',
    
    # 분석 기간 (일 단위)
    'period_days': 30,
    
    # 분석할 종목 수 (각 시장에서)
    'sample_size': 100,
    
    # 데이터 수집 기간 ('1y', '6mo', '3mo', '1mo')
    'data_period': '1y',
    
    # 하락률 구간 설정
    'decline_bins': [-100, -30, -20, -10, -5, 0, 10, 100],
    'decline_labels': ['-30% 이상', '-20~-30%', '-10~-20%', '-5~-10%', '-5~0%', '0~10%', '10% 이상']
}

# 출력 파일 설정
OUTPUT_CONFIG = {
    'excel_filename': 'korean_stock_decline_analysis.xlsx',
    'html_report_filename': 'korean_stock_decline_report.html',
    'visualization_filename': 'korean_stock_decline_visualization.html'
}

# 시각화 설정
VISUALIZATION_CONFIG = {
    'figure_height': 800,
    'histogram_bins': 30,
    'top_decline_count': 10,  # 상위 하락 종목 표시 개수
    'color_scheme': 'viridis'
}

# API 설정 (필요시 추가)
API_CONFIG = {
    'yfinance_timeout': 30,
    'max_retries': 3,
    'delay_between_requests': 0.1  # 초 단위
}