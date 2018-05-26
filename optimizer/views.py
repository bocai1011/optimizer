from django.http import HttpResponse,JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .settings import BASE_DIR
from .process import *
import os
import numpy
import pandas

DB_JS_DATA = os.path.join(BASE_DIR,'js_data.db')

def index(request):
    return render(request, 'index.html')

def api_load_data(request):
    if os.path.exists(DB_JS_DATA):
        df = pandas.read_pickle(DB_JS_DATA)
        format_df(df)
    else:
        columns = ['Name (BBG)','Maturity Date', 'ISIN',\
            'Exposure Country',\
            'Exposure Currency',\
            'Yield', 'Duration', 'Spread',\
            'Orig Face', 'Total MV', 'MV%']
        df = pandas.read_csv(os.path.join(BASE_DIR,'testdata.csv'))
        df['Yield'] = df['YTW']
        df['Duration'] = df['OAD']
        df['Spread'] = df['OAS']
        df = df[columns].copy()
    return HttpResponse(df.to_json(orient='records'), content_type="application/json")

def api_load_agg(request):
    if os.path.exists(DB_JS_AGG):
        agg = pandas.read_pickle(DB_JS_AGG)
    else:
        df = pandas.read_pickle(DB_JS_DATA)
        agg = calculate_agg(df)
    return HttpResponse(agg.to_json(orient='records'), content_type="application/json")

@csrf_exempt
def api_update_data(request):
    json_data = request.POST['js_data']
    df = pandas.read_json(json_data,orient='records')
    process_df(df)
    df.to_pickle(DB_JS_DATA)
    return HttpResponse('Update OK!')