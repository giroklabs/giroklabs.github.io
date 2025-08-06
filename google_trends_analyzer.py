#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
구글 트렌드를 이용한 블로그 검색어 순위 분석기
Google Trends Blog Keyword Ranking Analyzer
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pytrends.request import TrendReq
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import time
import warnings

warnings.filterwarnings('ignore')

class GoogleTrendsAnalyzer:
    def __init__(self, language='ko', timezone=540):
        """
        구글 트렌드 분석기 초기화
        
        Args:
            language (str): 언어 코드 (기본값: 'ko' - 한국어)
            timezone (int): 시간대 (기본값: 540 - 한국 시간)
        """
        self.pytrends = TrendReq(hl=language, tz=timezone)
        self.language = language
        self.timezone = timezone
        
        # 한국 블로그 관련 인기 키워드들
        self.popular_blog_keywords = [
            '맛집', '여행', '카페', '맛집 추천', '데이트',
            '운동', '다이어트', '요리', '패션', '뷰티',
            '육아', '일상', '취미', '독서', '영화',
            '드라마', 'K-pop', '게임', '투자', '부동산'
        ]
        
    def get_trending_searches(self, country='KR'):
        """
        실시간 트렌딩 검색어 가져오기
        
        Args:
            country (str): 국가 코드 (기본값: 'KR' - 한국)
            
        Returns:
            list: 트렌딩 검색어 리스트
        """
        try:
            trending_searches = self.pytrends.trending_searches(pn=country)
            return trending_searches[0].tolist()
        except Exception as e:
            print(f"트렌딩 검색어 가져오기 실패: {e}")
            return []
    
    def analyze_keywords_interest(self, keywords, timeframe='today 12-m', geo='KR'):
        """
        키워드들의 관심도 분석
        
        Args:
            keywords (list): 분석할 키워드 리스트
            timeframe (str): 시간 범위 (기본값: 'today 12-m' - 최근 12개월)
            geo (str): 지역 코드 (기본값: 'KR' - 한국)
            
        Returns:
            pd.DataFrame: 키워드별 관심도 데이터
        """
        try:
            # 한 번에 최대 5개 키워드만 비교 가능
            if len(keywords) > 5:
                print(f"한 번에 최대 5개 키워드만 비교할 수 있습니다. 처음 5개만 분석합니다.")
                keywords = keywords[:5]
            
            self.pytrends.build_payload(keywords, cat=0, timeframe=timeframe, geo=geo)
            interest_over_time = self.pytrends.interest_over_time()
            
            if not interest_over_time.empty:
                # 'isPartial' 컬럼 제거
                if 'isPartial' in interest_over_time.columns:
                    interest_over_time = interest_over_time.drop('isPartial', axis=1)
                    
            return interest_over_time
            
        except Exception as e:
            print(f"키워드 관심도 분석 실패: {e}")
            return pd.DataFrame()
    
    def get_related_queries(self, keyword, timeframe='today 12-m', geo='KR'):
        """
        특정 키워드의 관련 검색어 가져오기
        
        Args:
            keyword (str): 분석할 키워드
            timeframe (str): 시간 범위
            geo (str): 지역 코드
            
        Returns:
            dict: 관련 검색어 정보
        """
        try:
            self.pytrends.build_payload([keyword], cat=0, timeframe=timeframe, geo=geo)
            related_queries = self.pytrends.related_queries()
            return related_queries[keyword]
        except Exception as e:
            print(f"관련 검색어 가져오기 실패: {e}")
            return {}
    
    def analyze_blog_trends(self, custom_keywords=None, timeframe='today 12-m'):
        """
        블로그 트렌드 종합 분석
        
        Args:
            custom_keywords (list): 사용자 정의 키워드 (없으면 기본 블로그 키워드 사용)
            timeframe (str): 시간 범위
            
        Returns:
            dict: 분석 결과
        """
        keywords = custom_keywords if custom_keywords else self.popular_blog_keywords[:5]
        
        print(f"분석 중인 키워드: {keywords}")
        print("=" * 50)
        
        # 키워드 관심도 분석
        interest_data = self.analyze_keywords_interest(keywords, timeframe)
        
        results = {
            'keywords': keywords,
            'interest_data': interest_data,
            'trending_searches': self.get_trending_searches(),
            'related_queries': {}
        }
        
        # 각 키워드별 관련 검색어 분석 (API 제한으로 인해 시간 간격 추가)
        for i, keyword in enumerate(keywords):
            if i > 0:  # 첫 번째 키워드가 아니면 잠시 대기
                time.sleep(1)
            results['related_queries'][keyword] = self.get_related_queries(keyword, timeframe)
        
        return results
    
    def visualize_trends(self, results, save_plots=True):
        """
        트렌드 데이터 시각화
        
        Args:
            results (dict): analyze_blog_trends()의 결과
            save_plots (bool): 그래프를 파일로 저장할지 여부
        """
        interest_data = results['interest_data']
        
        if interest_data.empty:
            print("시각화할 데이터가 없습니다.")
            return
        
        # 한글 폰트 설정
        plt.rcParams['font.family'] = 'DejaVu Sans'
        plt.rcParams['axes.unicode_minus'] = False
        
        # 1. 시간별 관심도 변화 (선 그래프)
        plt.figure(figsize=(15, 8))
        
        plt.subplot(2, 2, 1)
        for column in interest_data.columns:
            plt.plot(interest_data.index, interest_data[column], marker='o', label=column, linewidth=2)
        plt.title('Keywords Interest Over Time', fontsize=14, fontweight='bold')
        plt.xlabel('Date')
        plt.ylabel('Interest Level')
        plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        
        # 2. 평균 관심도 비교 (막대 그래프)
        plt.subplot(2, 2, 2)
        avg_interest = interest_data.mean().sort_values(ascending=False)
        colors = plt.cm.Set3(range(len(avg_interest)))
        bars = plt.bar(range(len(avg_interest)), avg_interest.values, color=colors)
        plt.title('Average Interest Level by Keyword', fontsize=14, fontweight='bold')
        plt.xlabel('Keywords')
        plt.ylabel('Average Interest Level')
        plt.xticks(range(len(avg_interest)), avg_interest.index, rotation=45, ha='right')
        
        # 막대 위에 값 표시
        for i, bar in enumerate(bars):
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                    f'{height:.1f}', ha='center', va='bottom')
        
        # 3. 히트맵
        plt.subplot(2, 2, 3)
        correlation_matrix = interest_data.corr()
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0,
                   square=True, fmt='.2f')
        plt.title('Keyword Correlation Heatmap', fontsize=14, fontweight='bold')
        
        # 4. 최근 30일 트렌드
        plt.subplot(2, 2, 4)
        recent_data = interest_data.tail(30)
        for column in recent_data.columns:
            plt.plot(recent_data.index, recent_data[column], marker='o', label=column)
        plt.title('Recent 30 Days Trend', fontsize=14, fontweight='bold')
        plt.xlabel('Date')
        plt.ylabel('Interest Level')
        plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.xticks(rotation=45)
        plt.grid(True, alpha=0.3)
        
        plt.tight_layout()
        
        if save_plots:
            plt.savefig('/workspace/blog_trends_analysis.png', dpi=300, bbox_inches='tight')
            print("그래프가 'blog_trends_analysis.png'로 저장되었습니다.")
        
        plt.show()
    
    def generate_report(self, results, filename='/workspace/blog_trends_report.txt'):
        """
        분석 결과 리포트 생성
        
        Args:
            results (dict): analyze_blog_trends()의 결과
            filename (str): 저장할 파일명
        """
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("=" * 60 + "\n")
            f.write("구글 트렌드 블로그 검색어 순위 분석 리포트\n")
            f.write("Google Trends Blog Keywords Ranking Report\n")
            f.write("=" * 60 + "\n\n")
            f.write(f"분석 일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            # 분석 키워드
            f.write("분석 키워드:\n")
            for i, keyword in enumerate(results['keywords'], 1):
                f.write(f"{i}. {keyword}\n")
            f.write("\n")
            
            # 키워드별 평균 관심도 순위
            if not results['interest_data'].empty:
                avg_interest = results['interest_data'].mean().sort_values(ascending=False)
                f.write("키워드별 평균 관심도 순위:\n")
                for i, (keyword, score) in enumerate(avg_interest.items(), 1):
                    f.write(f"{i}. {keyword}: {score:.2f}\n")
                f.write("\n")
            
            # 실시간 트렌딩 검색어
            if results['trending_searches']:
                f.write("실시간 트렌딩 검색어 (Top 10):\n")
                for i, trend in enumerate(results['trending_searches'][:10], 1):
                    f.write(f"{i}. {trend}\n")
                f.write("\n")
            
            # 키워드별 관련 검색어
            f.write("키워드별 관련 검색어:\n")
            for keyword, related in results['related_queries'].items():
                f.write(f"\n[{keyword}]의 관련 검색어:\n")
                if related and 'top' in related and related['top'] is not None:
                    f.write("- 인기 관련 검색어:\n")
                    for _, row in related['top'].head(5).iterrows():
                        f.write(f"  · {row['query']} (관심도: {row['value']})\n")
                if related and 'rising' in related and related['rising'] is not None:
                    f.write("- 급상승 관련 검색어:\n")
                    for _, row in related['rising'].head(5).iterrows():
                        f.write(f"  · {row['query']} (상승률: {row['value']})\n")
        
        print(f"분석 리포트가 '{filename}'에 저장되었습니다.")

def main():
    """메인 함수"""
    print("구글 트렌드 블로그 검색어 순위 분석기")
    print("=" * 50)
    
    # 분석기 초기화
    analyzer = GoogleTrendsAnalyzer()
    
    # 사용자 입력 받기
    print("\n1. 기본 블로그 키워드 분석")
    print("2. 사용자 정의 키워드 분석")
    choice = input("선택하세요 (1 또는 2): ").strip()
    
    custom_keywords = None
    if choice == '2':
        keywords_input = input("분석할 키워드들을 쉼표로 구분해서 입력하세요 (최대 5개): ")
        custom_keywords = [k.strip() for k in keywords_input.split(',') if k.strip()]
        if len(custom_keywords) > 5:
            print("최대 5개 키워드만 분석할 수 있습니다. 처음 5개를 사용합니다.")
            custom_keywords = custom_keywords[:5]
    
    # 시간 범위 선택
    print("\n시간 범위를 선택하세요:")
    print("1. 최근 7일 (today 7-d)")
    print("2. 최근 30일 (today 1-m)")
    print("3. 최근 3개월 (today 3-m)")
    print("4. 최근 12개월 (today 12-m)")
    print("5. 최근 5년 (today 5-y)")
    
    timeframe_choice = input("선택하세요 (1-5): ").strip()
    timeframe_map = {
        '1': 'today 7-d',
        '2': 'today 1-m',
        '3': 'today 3-m',
        '4': 'today 12-m',
        '5': 'today 5-y'
    }
    timeframe = timeframe_map.get(timeframe_choice, 'today 12-m')
    
    print(f"\n분석을 시작합니다... (시간 범위: {timeframe})")
    
    try:
        # 트렌드 분석 실행
        results = analyzer.analyze_blog_trends(custom_keywords, timeframe)
        
        # 결과 출력
        print("\n" + "=" * 50)
        print("분석 결과")
        print("=" * 50)
        
        if not results['interest_data'].empty:
            avg_interest = results['interest_data'].mean().sort_values(ascending=False)
            print("\n키워드별 평균 관심도 순위:")
            for i, (keyword, score) in enumerate(avg_interest.items(), 1):
                print(f"{i}. {keyword}: {score:.2f}")
        
        if results['trending_searches']:
            print(f"\n실시간 트렌딩 검색어 (Top 10):")
            for i, trend in enumerate(results['trending_searches'][:10], 1):
                print(f"{i}. {trend}")
        
        # 시각화 및 리포트 생성
        print("\n시각화 그래프를 생성하고 있습니다...")
        analyzer.visualize_trends(results)
        
        print("\n분석 리포트를 생성하고 있습니다...")
        analyzer.generate_report(results)
        
        print("\n분석이 완료되었습니다!")
        print("- 그래프: blog_trends_analysis.png")
        print("- 리포트: blog_trends_report.txt")
        
    except Exception as e:
        print(f"분석 중 오류가 발생했습니다: {e}")
        print("인터넷 연결을 확인하고 다시 시도해주세요.")

if __name__ == "__main__":
    main()