#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
구글 트렌드 블로그 검색어 순위 분석기 - 빠른 데모
Quick Demo for Google Trends Blog Keywords Analyzer
"""

from google_trends_analyzer import GoogleTrendsAnalyzer
import matplotlib
matplotlib.use('Agg')  # GUI 없는 환경에서 사용

def quick_demo():
    """빠른 데모 실행"""
    print("🔍 구글 트렌드 블로그 검색어 순위 분석기 - 빠른 데모")
    print("=" * 60)
    
    # 분석기 초기화
    analyzer = GoogleTrendsAnalyzer()
    
    # 데모용 키워드 (한국 블로그에서 인기 있는 키워드들)
    demo_keywords = ['맛집', '여행', '카페', '운동', '요리']
    timeframe = 'today 3-m'  # 최근 3개월
    
    print(f"📊 분석 키워드: {demo_keywords}")
    print(f"⏰ 분석 기간: {timeframe}")
    print("\n분석을 시작합니다...")
    
    try:
        # 트렌드 분석 실행
        results = analyzer.analyze_blog_trends(demo_keywords, timeframe)
        
        print("\n✅ 분석 완료!")
        print("=" * 60)
        
        # 결과 출력
        if not results['interest_data'].empty:
            avg_interest = results['interest_data'].mean().sort_values(ascending=False)
            print("\n🏆 키워드별 평균 관심도 순위:")
            for i, (keyword, score) in enumerate(avg_interest.items(), 1):
                print(f"  {i}. {keyword}: {score:.2f}점")
        
        if results['trending_searches']:
            print(f"\n🔥 실시간 트렌딩 검색어 (Top 5):")
            for i, trend in enumerate(results['trending_searches'][:5], 1):
                print(f"  {i}. {trend}")
        
        # 시각화 (GUI 없이 파일로만 저장)
        print("\n📈 시각화 그래프를 생성 중...")
        analyzer.visualize_trends(results, save_plots=True)
        
        # 리포트 생성
        print("📋 분석 리포트를 생성 중...")
        analyzer.generate_report(results)
        
        print("\n🎉 데모 완료!")
        print("생성된 파일:")
        print("  - blog_trends_analysis.png (시각화 그래프)")
        print("  - blog_trends_report.txt (상세 분석 리포트)")
        
        # 간단한 분석 결과 요약
        if not results['interest_data'].empty:
            top_keyword = avg_interest.index[0]
            top_score = avg_interest.iloc[0]
            print(f"\n💡 분석 요약:")
            print(f"  - 가장 인기 있는 키워드: '{top_keyword}' ({top_score:.2f}점)")
            print(f"  - 총 분석 키워드: {len(demo_keywords)}개")
            print(f"  - 데이터 기간: {timeframe}")
        
    except Exception as e:
        print(f"❌ 분석 중 오류가 발생했습니다: {e}")
        print("인터넷 연결을 확인하고 다시 시도해주세요.")

if __name__ == "__main__":
    quick_demo()