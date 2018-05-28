from django.http import HttpResponse,JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .settings import BASE_DIR
from .process import *
from .optimize import *
import os
import numpy
import pandas

DB_JS_DATA = os.path.join(BASE_DIR,'js_data.db')
DB_JS_RESULT_DATA = os.path.join(BASE_DIR,'js_result_data.db')
DB_JS_AGG = os.path.join(BASE_DIR,'js_agg.db')
DB_JS_RESULT_AGG = os.path.join(BASE_DIR,'js_result_agg.db')

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def api_optimize(request):
    df = pandas.read_pickle(DB_JS_DATA)
    try:
        agg = pandas.read_pickle(DB_JS_AGG)
    except:
        agg = calculate_agg(df)
        agg.to_pickle(DB_JS_AGG)
    status, solution = opti(df,agg)
    df['Weight'] = df['MV%']
    df['Buy weight'] = solution.flatten()
    df['New weight'] = df['Weight'] + df['Buy weight']
    df.to_pickle(DB_JS_RESULT_DATA)
    return HttpResponse("Problem status: " + status)

@csrf_exempt
def api_load_data(request):
    if os.path.exists(DB_JS_DATA):
        df = pandas.read_pickle(DB_JS_DATA)
        df = format_df(df)
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
        process_df(df)
        df.to_pickle(DB_JS_DATA)
        df = format_df(df)
    return HttpResponse(df.to_json(orient='records'), content_type="application/json")

@csrf_exempt
def api_load_result_data(request):
    if os.path.exists(DB_JS_DATA):
        df = pandas.read_pickle(DB_JS_RESULT_DATA)
        df = df[df['Buy weight']!=0].copy()
        return HttpResponse(df.to_json(orient='records'), content_type="application/json")
    else:
        return HttpResponse("Error loading result data.",status=404)

@csrf_exempt
def api_load_agg(request):
    if os.path.exists(DB_JS_AGG):
        agg = pandas.read_pickle(DB_JS_AGG)
        return HttpResponse(agg.to_json(orient='records'), content_type="application/json")
    elif os.path.exists(DB_JS_DATA):
        df = pandas.read_pickle(DB_JS_DATA)
        agg = calculate_agg(df)
        return HttpResponse(agg.to_json(orient='records'), content_type="application/json")
    else:
        return HttpResponse("Agg is not available!",status=404)

@csrf_exempt
def api_load_result_agg(request):
    if os.path.exists(DB_JS_RESULT_AGG):
        agg = pandas.read_pickle(DB_JS_RESULT_AGG)
        return HttpResponse(agg.to_json(orient='records'), content_type="application/json")
    elif os.path.exists(DB_JS_RESULT_DATA):
        df = pandas.read_pickle(DB_JS_RESULT_DATA)
        agg = calculate_result_agg(df)
        return HttpResponse(agg.to_json(orient='records'), content_type="application/json")
    else:
        return HttpResponse("Reuslt AGG is not available!",status=404)

@csrf_exempt
def api_update_agg(request):
    json_data = request.POST['js_data']
    df = pandas.read_json(json_data,orient='records')
    df.to_pickle(DB_JS_AGG)
    return HttpResponse('Update OK!')

@csrf_exempt
def api_update_data(request):
    json_data = request.POST['js_data']
    df = pandas.read_json(json_data,orient='records')
    process_df(df)
    df.to_pickle(DB_JS_DATA)
    return HttpResponse('Update OK!')