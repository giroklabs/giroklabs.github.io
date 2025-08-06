#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Korean Stock Market Decline Analysis - Quick Run Script
코스피, 코스닥 하락률 분석 간편 실행 스크립트
"""

import sys
import os
from config import ANALYSIS_CONFIG, OUTPUT_CONFIG
from korean_stock_analysis import KoreanStockAnalyzer

def print_banner():
    """시작 배너 출력"""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║           한국 주식 시장 하락률 분석 도구 v1.0                    ║
    ║                Korean Stock Decline Analyzer                ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)

def show_current_settings():
    """현재 설정 표시"""
    print("📊 현재 분석 설정:")
    print(f"   • 분석 시장: {ANALYSIS_CONFIG['market'].upper()}")
    print(f"   • 분석 기간: {ANALYSIS_CONFIG['period_days']}일")
    print(f"   • 샘플 크기: {ANALYSIS_CONFIG['sample_size']}개 종목")
    print(f"   • 데이터 기간: {ANALYSIS_CONFIG['data_period']}")
    print()

def get_user_choice():
    """사용자 선택 받기"""
    print("🔧 분석 설정을 변경하시겠습니까?")
    print("1. 기본 설정으로 바로 실행")
    print("2. 설정 변경 후 실행")
    print("3. 종료")
    
    choice = input("\n선택하세요 (1-3): ").strip()
    return choice

def customize_settings():
    """설정 커스터마이징"""
    print("\n🔧 설정 변경")
    print("-" * 50)
    
    # 시장 선택
    print("분석할 시장을 선택하세요:")
    print("1. KOSPI만")
    print("2. KOSDAQ만") 
    print("3. KOSPI + KOSDAQ (기본값)")
    
    market_choice = input("선택 (1-3, 기본값: 3): ").strip()
    if market_choice == '1':
        ANALYSIS_CONFIG['market'] = 'kospi'
    elif market_choice == '2':
        ANALYSIS_CONFIG['market'] = 'kosdaq'
    else:
        ANALYSIS_CONFIG['market'] = 'both'
    
    # 분석 기간
    try:
        period = input(f"분석 기간 (일, 기본값: {ANALYSIS_CONFIG['period_days']}): ").strip()
        if period:
            ANALYSIS_CONFIG['period_days'] = int(period)
    except ValueError:
        print("⚠️  잘못된 입력입니다. 기본값을 사용합니다.")
    
    # 샘플 크기
    try:
        sample = input(f"분석할 종목 수 (기본값: {ANALYSIS_CONFIG['sample_size']}): ").strip()
        if sample:
            ANALYSIS_CONFIG['sample_size'] = int(sample)
    except ValueError:
        print("⚠️  잘못된 입력입니다. 기본값을 사용합니다.")
    
    print("\n✅ 설정이 업데이트되었습니다!")

def run_analysis():
    """분석 실행"""
    print("\n🚀 분석을 시작합니다...")
    print("=" * 60)
    
    try:
        # 분석기 초기화
        analyzer = KoreanStockAnalyzer()
        
        # 종목 리스트 수집
        if not analyzer.get_stock_list():
            print("❌ 종목 리스트 수집에 실패했습니다.")
            return False
        
        # 하락률 분석 수행
        df_results, stats = analyzer.analyze_market_decline(
            market=ANALYSIS_CONFIG['market'],
            period_days=ANALYSIS_CONFIG['period_days'],
            sample_size=ANALYSIS_CONFIG['sample_size']
        )
        
        if df_results is not None and stats is not None:
            print("\n📈 분석 결과:")
            print(f"   • 총 분석 종목 수: {stats['총_종목수']:,}개")
            print(f"   • 평균 하락률: {stats['평균_하락률']:.2f}%")
            print(f"   • 중앙값 하락률: {stats['중앙값_하락률']:.2f}%")
            print(f"   • 최대 하락률: {stats['최대_하락률']:.2f}%")
            
            # 시각화 및 리포트 생성
            print("\n📊 시각화 및 리포트를 생성중입니다...")
            
            # 시각화
            fig = analyzer.create_visualizations(df_results, stats)
            fig.write_html(OUTPUT_CONFIG['visualization_filename'])
            
            # HTML 리포트
            analyzer.generate_report(df_results, stats, 
                                   OUTPUT_CONFIG['html_report_filename'].replace('.html', ''))
            
            # Excel 저장
            analyzer.save_to_excel(df_results, stats, OUTPUT_CONFIG['excel_filename'])
            
            print("\n✅ 분석 완료!")
            print("📁 생성된 파일:")
            print(f"   • {OUTPUT_CONFIG['html_report_filename']} (HTML 리포트)")
            print(f"   • {OUTPUT_CONFIG['visualization_filename']} (시각화)")
            print(f"   • {OUTPUT_CONFIG['excel_filename']} (Excel 데이터)")
            
            return True
            
        else:
            print("❌ 분석을 완료할 수 없습니다.")
            return False
            
    except Exception as e:
        print(f"❌ 분석 중 오류가 발생했습니다: {e}")
        return False

def main():
    """메인 함수"""
    print_banner()
    
    # 현재 설정 표시
    show_current_settings()
    
    # 사용자 선택
    choice = get_user_choice()
    
    if choice == '1':
        # 기본 설정으로 실행
        run_analysis()
        
    elif choice == '2':
        # 설정 변경 후 실행
        customize_settings()
        show_current_settings()
        
        confirm = input("이 설정으로 분석을 시작하시겠습니까? (y/n): ").strip().lower()
        if confirm in ['y', 'yes', '예', 'ㅇ']:
            run_analysis()
        else:
            print("분석이 취소되었습니다.")
            
    elif choice == '3':
        print("프로그램을 종료합니다.")
        return
        
    else:
        print("❌ 잘못된 선택입니다.")
        return
    
    print("\n🎉 프로그램이 완료되었습니다!")

if __name__ == "__main__":
    main()