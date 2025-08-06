#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Korean Stock Market Decline Analysis
코스피, 코스닥 종목 하락률 통계 분석 도구

이 스크립트는 다음 기능을 제공합니다:
1. 코스피, 코스닥 전체 종목 리스트 수집
2. 각 종목의 일정 기간 하락률 계산
3. 하락률 통계 분석 및 시각화
4. 결과를 Excel 및 HTML 리포트로 저장
"""

import pandas as pd
import numpy as np
import yfinance as yf
import FinanceDataReader as fdr
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import warnings
from datetime import datetime, timedelta
import os
import sys

# 한글 폰트 설정
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['axes.unicode_minus'] = False
warnings.filterwarnings('ignore')

class KoreanStockAnalyzer:
    """한국 주식 시장 하락률 분석 클래스"""
    
    def __init__(self):
        self.kospi_stocks = None
        self.kosdaq_stocks = None
        self.price_data = {}
        self.decline_stats = {}
        
    def get_stock_list(self):
        """코스피, 코스닥 종목 리스트 수집"""
        print("코스피, 코스닥 종목 리스트를 수집중입니다...")
        
        try:
            # FinanceDataReader를 사용하여 종목 리스트 수집
            self.kospi_stocks = fdr.StockListing('KOSPI')
            self.kosdaq_stocks = fdr.StockListing('KOSDAQ')
            
            print(f"코스피 종목 수: {len(self.kospi_stocks)}")
            print(f"코스닥 종목 수: {len(self.kosdaq_stocks)}")
            
            return True
            
        except Exception as e:
            print(f"종목 리스트 수집 중 오류 발생: {e}")
            return False
    
    def get_stock_data(self, symbol, period='1y'):
        """개별 종목 데이터 수집"""
        try:
            # 한국 종목의 경우 .KS (코스피) 또는 .KQ (코스닥) 접미사 추가
            if '.' not in symbol:
                # 코스피 종목인지 코스닥 종목인지 확인
                if symbol in self.kospi_stocks['Code'].values:
                    symbol = f"{symbol}.KS"
                elif symbol in self.kosdaq_stocks['Code'].values:
                    symbol = f"{symbol}.KQ"
            
            stock = yf.Ticker(symbol)
            data = stock.history(period=period)
            
            if data.empty:
                return None
                
            return data
            
        except Exception as e:
            print(f"종목 {symbol} 데이터 수집 실패: {e}")
            return None
    
    def calculate_decline_rate(self, data, period_days=30):
        """지정된 기간 동안의 최대 하락률 계산"""
        if data is None or len(data) < period_days:
            return None
            
        try:
            # 최근 지정 기간의 데이터만 사용
            recent_data = data.tail(period_days)
            
            # 최고점에서 최저점까지의 하락률 계산
            max_price = recent_data['High'].max()
            min_price = recent_data['Low'].min()
            
            decline_rate = ((min_price - max_price) / max_price) * 100
            
            # 기간 시작과 끝의 수익률도 계산
            period_return = ((recent_data['Close'].iloc[-1] - recent_data['Close'].iloc[0]) / recent_data['Close'].iloc[0]) * 100
            
            return {
                'max_decline': decline_rate,
                'period_return': period_return,
                'max_price': max_price,
                'min_price': min_price,
                'current_price': recent_data['Close'].iloc[-1]
            }
            
        except Exception as e:
            print(f"하락률 계산 중 오류: {e}")
            return None
    
    def analyze_market_decline(self, market='both', period_days=30, sample_size=100):
        """시장 전체 하락률 분석"""
        print(f"\n{period_days}일 기간 하락률 분석을 시작합니다...")
        
        results = []
        
        # 분석할 종목 리스트 결정
        if market.lower() == 'kospi':
            stocks_to_analyze = self.kospi_stocks.head(sample_size)
            market_name = 'KOSPI'
        elif market.lower() == 'kosdaq':
            stocks_to_analyze = self.kosdaq_stocks.head(sample_size)
            market_name = 'KOSDAQ'
        else:
            kospi_sample = self.kospi_stocks.head(sample_size // 2)
            kosdaq_sample = self.kosdaq_stocks.head(sample_size // 2)
            stocks_to_analyze = pd.concat([kospi_sample, kosdaq_sample])
            market_name = 'KOSPI + KOSDAQ'
        
        print(f"분석 대상: {market_name}, 종목 수: {len(stocks_to_analyze)}")
        
        for idx, row in stocks_to_analyze.iterrows():
            code = row['Code']
            name = row['Name']
            
            # 진행률 표시
            if idx % 10 == 0:
                print(f"진행률: {idx}/{len(stocks_to_analyze)} ({idx/len(stocks_to_analyze)*100:.1f}%)")
            
            # 종목 데이터 수집
            data = self.get_stock_data(code)
            
            if data is not None:
                decline_info = self.calculate_decline_rate(data, period_days)
                
                if decline_info is not None:
                    result = {
                        'Code': code,
                        'Name': name,
                        'Market': 'KOSPI' if code in self.kospi_stocks['Code'].values else 'KOSDAQ',
                        'Max_Decline_Rate': decline_info['max_decline'],
                        'Period_Return': decline_info['period_return'],
                        'Max_Price': decline_info['max_price'],
                        'Min_Price': decline_info['min_price'],
                        'Current_Price': decline_info['current_price']
                    }
                    results.append(result)
        
        # 결과를 DataFrame으로 변환
        df_results = pd.DataFrame(results)
        
        if not df_results.empty:
            # 통계 계산
            stats = self.calculate_statistics(df_results)
            self.decline_stats[f'{market_name}_{period_days}days'] = {
                'data': df_results,
                'stats': stats
            }
            
            return df_results, stats
        else:
            print("분석할 수 있는 데이터가 없습니다.")
            return None, None
    
    def calculate_statistics(self, df):
        """하락률 통계 계산"""
        stats = {}
        
        # 기본 통계
        stats['총_종목수'] = len(df)
        stats['평균_하락률'] = df['Max_Decline_Rate'].mean()
        stats['중앙값_하락률'] = df['Max_Decline_Rate'].median()
        stats['표준편차_하락률'] = df['Max_Decline_Rate'].std()
        stats['최대_하락률'] = df['Max_Decline_Rate'].min()  # 가장 많이 하락한 종목
        stats['최소_하락률'] = df['Max_Decline_Rate'].max()  # 가장 적게 하락한 종목
        
        # 하락률 구간별 분포
        bins = [-100, -30, -20, -10, -5, 0, 10, 100]
        labels = ['-30% 이상', '-20~-30%', '-10~-20%', '-5~-10%', '-5~0%', '0~10%', '10% 이상']
        df['Decline_Category'] = pd.cut(df['Max_Decline_Rate'], bins=bins, labels=labels, right=False)
        
        stats['구간별_분포'] = df['Decline_Category'].value_counts().to_dict()
        
        # 시장별 통계 (KOSPI vs KOSDAQ)
        if 'Market' in df.columns:
            market_stats = df.groupby('Market')['Max_Decline_Rate'].agg(['mean', 'median', 'std', 'min', 'max']).to_dict()
            stats['시장별_통계'] = market_stats
        
        return stats
    
    def create_visualizations(self, df, stats, title="한국 주식 시장 하락률 분석"):
        """데이터 시각화 생성"""
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('하락률 분포 히스토그램', '시장별 하락률 박스플롯', 
                           '하락률 구간별 종목 수', '상위 하락 종목'),
            specs=[[{"type": "xy"}, {"type": "xy"}],
                   [{"type": "xy"}, {"type": "xy"}]]
        )
        
        # 1. 하락률 분포 히스토그램
        fig.add_trace(
            go.Histogram(x=df['Max_Decline_Rate'], nbinsx=30, name='하락률 분포'),
            row=1, col=1
        )
        
        # 2. 시장별 박스플롯
        if 'Market' in df.columns:
            for market in df['Market'].unique():
                market_data = df[df['Market'] == market]['Max_Decline_Rate']
                fig.add_trace(
                    go.Box(y=market_data, name=market),
                    row=1, col=2
                )
        
        # 3. 구간별 분포
        category_counts = df['Decline_Category'].value_counts()
        fig.add_trace(
            go.Bar(x=category_counts.index, y=category_counts.values, name='구간별 종목 수'),
            row=2, col=1
        )
        
        # 4. 상위 하락 종목 (하위 10개)
        top_decline = df.nsmallest(10, 'Max_Decline_Rate')
        fig.add_trace(
            go.Bar(x=top_decline['Name'], y=top_decline['Max_Decline_Rate'], 
                   name='상위 하락 종목'),
            row=2, col=2
        )
        
        fig.update_layout(height=800, title_text=title, showlegend=False)
        fig.update_xaxes(title_text="하락률 (%)", row=1, col=1)
        fig.update_xaxes(title_text="시장", row=1, col=2)
        fig.update_xaxes(title_text="하락률 구간", row=2, col=1)
        fig.update_xaxes(title_text="종목명", row=2, col=2)
        fig.update_yaxes(title_text="종목 수", row=1, col=1)
        fig.update_yaxes(title_text="하락률 (%)", row=1, col=2)
        fig.update_yaxes(title_text="종목 수", row=2, col=1)
        fig.update_yaxes(title_text="하락률 (%)", row=2, col=2)
        
        return fig
    
    def generate_report(self, df, stats, filename="korean_stock_decline_report"):
        """HTML 리포트 생성"""
        html_content = f"""
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>한국 주식 시장 하락률 분석 리포트</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                .header {{ text-align: center; color: #333; }}
                .summary {{ background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                .stat-item {{ margin: 5px 0; }}
                table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
                th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                th {{ background-color: #f2f2f2; }}
                .decline {{ color: #d32f2f; }}
                .gain {{ color: #388e3c; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>한국 주식 시장 하락률 분석 리포트</h1>
                <p>생성일: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
            
            <div class="summary">
                <h2>주요 통계</h2>
                <div class="stat-item"><strong>분석 종목 수:</strong> {stats['총_종목수']:,}개</div>
                <div class="stat-item"><strong>평균 하락률:</strong> {stats['평균_하락률']:.2f}%</div>
                <div class="stat-item"><strong>중앙값 하락률:</strong> {stats['중앙값_하락률']:.2f}%</div>
                <div class="stat-item"><strong>표준편차:</strong> {stats['표준편차_하락률']:.2f}%</div>
                <div class="stat-item"><strong>최대 하락률:</strong> <span class="decline">{stats['최대_하락률']:.2f}%</span></div>
                <div class="stat-item"><strong>최소 하락률:</strong> <span class="gain">{stats['최소_하락률']:.2f}%</span></div>
            </div>
            
            <h2>하락률 구간별 분포</h2>
            <table>
                <tr><th>하락률 구간</th><th>종목 수</th><th>비율</th></tr>
        """
        
        for category, count in stats['구간별_분포'].items():
            percentage = (count / stats['총_종목수']) * 100
            html_content += f"<tr><td>{category}</td><td>{count}</td><td>{percentage:.1f}%</td></tr>"
        
        html_content += """
            </table>
            
            <h2>상위 하락 종목 (하위 20개)</h2>
            <table>
                <tr><th>순위</th><th>종목명</th><th>종목코드</th><th>시장</th><th>하락률</th><th>현재가</th></tr>
        """
        
        top_decline = df.nsmallest(20, 'Max_Decline_Rate')
        for idx, row in top_decline.iterrows():
            rank = top_decline.index.get_loc(idx) + 1
            html_content += f"""
                <tr>
                    <td>{rank}</td>
                    <td>{row['Name']}</td>
                    <td>{row['Code']}</td>
                    <td>{row['Market']}</td>
                    <td class="decline">{row['Max_Decline_Rate']:.2f}%</td>
                    <td>{row['Current_Price']:,.0f}원</td>
                </tr>
            """
        
        html_content += """
            </table>
        </body>
        </html>
        """
        
        with open(f"{filename}.html", 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"HTML 리포트가 {filename}.html에 저장되었습니다.")
    
    def save_to_excel(self, df, stats, filename="korean_stock_decline_analysis.xlsx"):
        """Excel 파일로 결과 저장"""
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            # 전체 데이터
            df.to_excel(writer, sheet_name='전체_데이터', index=False)
            
            # 통계 요약
            stats_df = pd.DataFrame.from_dict(stats, orient='index', columns=['값'])
            stats_df.to_excel(writer, sheet_name='통계_요약')
            
            # 상위 하락 종목
            top_decline = df.nsmallest(50, 'Max_Decline_Rate')
            top_decline.to_excel(writer, sheet_name='상위_하락_종목', index=False)
            
            # 시장별 데이터
            if 'Market' in df.columns:
                kospi_data = df[df['Market'] == 'KOSPI']
                kosdaq_data = df[df['Market'] == 'KOSDAQ']
                
                if not kospi_data.empty:
                    kospi_data.to_excel(writer, sheet_name='KOSPI', index=False)
                if not kosdaq_data.empty:
                    kosdaq_data.to_excel(writer, sheet_name='KOSDAQ', index=False)
        
        print(f"Excel 파일이 {filename}에 저장되었습니다.")

def main():
    """메인 실행 함수"""
    print("=== 한국 주식 시장 하락률 분석 도구 ===\n")
    
    # 분석기 초기화
    analyzer = KoreanStockAnalyzer()
    
    # 종목 리스트 수집
    if not analyzer.get_stock_list():
        print("종목 리스트 수집에 실패했습니다.")
        return
    
    # 사용자 설정 (기본값)
    market = 'both'  # 'kospi', 'kosdaq', 'both'
    period_days = 30  # 분석 기간 (일)
    sample_size = 100  # 분석할 종목 수
    
    print(f"\n분석 설정:")
    print(f"- 시장: {market}")
    print(f"- 분석 기간: {period_days}일")
    print(f"- 샘플 크기: {sample_size}개 종목")
    
    # 하락률 분석 수행
    df_results, stats = analyzer.analyze_market_decline(
        market=market, 
        period_days=period_days, 
        sample_size=sample_size
    )
    
    if df_results is not None and stats is not None:
        print("\n=== 분석 결과 ===")
        print(f"총 분석 종목 수: {stats['총_종목수']}개")
        print(f"평균 하락률: {stats['평균_하락률']:.2f}%")
        print(f"중앙값 하락률: {stats['중앙값_하락률']:.2f}%")
        print(f"최대 하락률: {stats['최대_하락률']:.2f}%")
        
        # 시각화 생성
        print("\n시각화를 생성중입니다...")
        fig = analyzer.create_visualizations(df_results, stats)
        fig.write_html("korean_stock_decline_visualization.html")
        print("시각화가 korean_stock_decline_visualization.html에 저장되었습니다.")
        
        # 리포트 생성
        print("\n리포트를 생성중입니다...")
        analyzer.generate_report(df_results, stats)
        
        # Excel 저장
        print("\nExcel 파일을 저장중입니다...")
        analyzer.save_to_excel(df_results, stats)
        
        print("\n=== 분석 완료 ===")
        print("생성된 파일:")
        print("- korean_stock_decline_report.html (HTML 리포트)")
        print("- korean_stock_decline_visualization.html (시각화)")
        print("- korean_stock_decline_analysis.xlsx (Excel 데이터)")
        
    else:
        print("분석을 완료할 수 없습니다.")

if __name__ == "__main__":
    main()