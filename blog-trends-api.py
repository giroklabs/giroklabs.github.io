#!/usr/bin/env python3
"""
블로그 검색어 추이 분석 API 서버
네이버 블로그 검색 API와 Google Trends를 활용한 검색어 동향 분석
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from datetime import datetime, timedelta
import os
from pytrends.request import TrendReq
import time

app = Flask(__name__)
CORS(app)  # 프론트엔드에서 API 호출 허용

# 네이버 API 설정 (환경변수에서 읽기)
NAVER_CLIENT_ID = os.getenv('NAVER_CLIENT_ID', 'YOUR_CLIENT_ID')
NAVER_CLIENT_SECRET = os.getenv('NAVER_CLIENT_SECRET', 'YOUR_CLIENT_SECRET')

class BlogTrendsAnalyzer:
    def __init__(self):
        self.pytrends = TrendReq(hl='ko', tz=540)  # 한국 시간대
    
    def search_naver_blog(self, keyword, start_date=None, end_date=None, sort='sim'):
        """
        네이버 블로그 검색 API를 통한 검색어 추이 분석
        """
        url = "https://openapi.naver.com/v1/search/blog.json"
        headers = {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
        
        # 기간별 검색 결과 수 추적
        if not start_date:
            start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        
        daily_counts = []
        current_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_datetime = datetime.strptime(end_date, '%Y-%m-%d')
        
        while current_date <= end_datetime:
            # 하루씩 검색
            date_str = current_date.strftime('%Y%m%d')
            params = {
                'query': keyword,
                'display': 100,  # 최대 100개
                'sort': sort
            }
            
            try:
                response = requests.get(url, headers=headers, params=params)
                if response.status_code == 200:
                    data = response.json()
                    daily_counts.append({
                        'date': current_date.strftime('%Y-%m-%d'),
                        'count': data.get('total', 0)
                    })
                else:
                    daily_counts.append({
                        'date': current_date.strftime('%Y-%m-%d'),
                        'count': 0,
                        'error': f"API Error: {response.status_code}"
                    })
            except Exception as e:
                daily_counts.append({
                    'date': current_date.strftime('%Y-%m-%d'),
                    'count': 0,
                    'error': str(e)
                })
            
            current_date += timedelta(days=1)
            time.sleep(0.1)  # API 제한 방지
        
        return {
            'keyword': keyword,
            'period': f"{start_date} ~ {end_date}",
            'daily_trends': daily_counts,
            'summary': self._calculate_summary(daily_counts)
        }
    
    def get_google_trends(self, keyword, timeframe='today 1-m', geo='KR'):
        """
        Google Trends 데이터 조회
        """
        try:
            self.pytrends.build_payload([keyword], timeframe=timeframe, geo=geo)
            
            # 시간별 관심도 데이터
            interest_over_time = self.pytrends.interest_over_time()
            
            # 관련 검색어
            related_queries = self.pytrends.related_queries()
            
            # 지역별 관심도
            interest_by_region = self.pytrends.interest_by_region()
            
            return {
                'keyword': keyword,
                'geo': geo,
                'timeframe': timeframe,
                'interest_over_time': interest_over_time.to_dict('records') if not interest_over_time.empty else [],
                'related_queries': related_queries,
                'interest_by_region': interest_by_region.to_dict('index') if not interest_by_region.empty else {}
            }
        except Exception as e:
            return {'error': str(e)}
    
    def _calculate_summary(self, daily_counts):
        """
        검색 추이 요약 정보 계산
        """
        if not daily_counts:
            return {}
        
        counts = [item['count'] for item in daily_counts if isinstance(item['count'], int)]
        if not counts:
            return {}
        
        total_count = sum(counts)
        avg_count = total_count / len(counts)
        max_count = max(counts)
        min_count = min(counts)
        
        # 증가/감소 추세 계산
        first_week = counts[:7] if len(counts) >= 7 else counts[:len(counts)//2]
        last_week = counts[-7:] if len(counts) >= 7 else counts[len(counts)//2:]
        
        first_avg = sum(first_week) / len(first_week) if first_week else 0
        last_avg = sum(last_week) / len(last_week) if last_week else 0
        
        trend_percentage = ((last_avg - first_avg) / first_avg * 100) if first_avg > 0 else 0
        
        return {
            'total_count': total_count,
            'average_count': round(avg_count, 2),
            'max_count': max_count,
            'min_count': min_count,
            'trend_percentage': round(trend_percentage, 2),
            'trend_direction': 'increasing' if trend_percentage > 0 else 'decreasing' if trend_percentage < 0 else 'stable'
        }

# API 엔드포인트들
analyzer = BlogTrendsAnalyzer()

@app.route('/api/naver-blog-trends', methods=['POST'])
def naver_blog_trends():
    """
    네이버 블로그 검색어 추이 API
    """
    data = request.get_json()
    keyword = data.get('keyword')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    sort = data.get('sort', 'sim')
    
    if not keyword:
        return jsonify({'error': '검색 키워드가 필요합니다.'}), 400
    
    try:
        result = analyzer.search_naver_blog(keyword, start_date, end_date, sort)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/google-trends', methods=['POST'])
def google_trends():
    """
    Google Trends API
    """
    data = request.get_json()
    keyword = data.get('keyword')
    timeframe = data.get('timeframe', 'today 1-m')
    geo = data.get('geo', 'KR')
    
    if not keyword:
        return jsonify({'error': '검색 키워드가 필요합니다.'}), 400
    
    try:
        result = analyzer.get_google_trends(keyword, timeframe, geo)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/combined-analysis', methods=['POST'])
def combined_analysis():
    """
    네이버 블로그 + Google Trends 통합 분석
    """
    data = request.get_json()
    keyword = data.get('keyword')
    
    if not keyword:
        return jsonify({'error': '검색 키워드가 필요합니다.'}), 400
    
    try:
        # 네이버 블로그 데이터
        naver_result = analyzer.search_naver_blog(keyword)
        
        # Google Trends 데이터
        google_result = analyzer.get_google_trends(keyword)
        
        return jsonify({
            'keyword': keyword,
            'naver_blog_trends': naver_result,
            'google_trends': google_result,
            'analysis_timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    API 상태 확인
    """
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'naver_api_configured': bool(NAVER_CLIENT_ID != 'YOUR_CLIENT_ID'),
        'google_trends_available': True
    })

if __name__ == '__main__':
    print("🚀 블로그 검색어 추이 분석 API 서버 시작")
    print("📋 사용 가능한 엔드포인트:")
    print("   POST /api/naver-blog-trends")
    print("   POST /api/google-trends")
    print("   POST /api/combined-analysis")
    print("   GET  /api/health")
    print("\n⚙️  환경 설정:")
    print(f"   네이버 API 설정: {'✅' if NAVER_CLIENT_ID != 'YOUR_CLIENT_ID' else '❌'}")
    print("\n🔧 필요한 환경변수:")
    print("   export NAVER_CLIENT_ID='your_client_id'")
    print("   export NAVER_CLIENT_SECRET='your_client_secret'")
    
    app.run(debug=True, host='0.0.0.0', port=5000)