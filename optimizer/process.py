import numpy
import pandas

__all__ = ['process_df','format_df']

def process_df(df):
    num_columns = ['MV%','Duration','Spread','Yield','Total MV']
    str_columns = []
    for col in num_columns:
        if df[col].dtype == numpy.object_:
            df[col] = df[col].str.replace('%','')
            df[col] = df[col].str.replace(',','')
            df[col] = df[col].astype(float)
    df['MV%'] = df['MV%'] / 100.0
    df['Yield'] = df['Yield'] / 100.0
    return

def format_df(df):
    df['MV%'] = df['MV%'] * 100.0
    df['Yield'] = df['Yield'] * 100.0
    df['MV%'] = df['MV%'].astype(str)
    df['MV%'] = df['MV%'] + '%'
    df['Yield'] = df['Yield'].astype(str)
    df['Yield'] = df['Yield'] + '%'
    return

def calculate_agg(df):
    agg = df.sum()
    return agg