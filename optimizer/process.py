import numpy
import pandas

__all__ = ['process_df','format_df','calculate_agg']

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
    df = df.copy()
    df['MV%'] = df['MV%'] * 100.0
    df['Yield'] = df['Yield'] * 100.0
    df['MV%'] = df['MV%'].astype(str)
    df['MV%'] = df['MV%'] + '%'
    df['Yield'] = df['Yield'].astype(str)
    df['Yield'] = df['Yield'] + '%'
    return df

def calculate_agg(df):
    agg_columns = ['MV%','Duration','Spread','Yield']
    df = df[agg_columns].copy()
    for col in agg_columns:
        if col == 'MV%': continue
        df[col] = df['MV%'] * df[col]
    df['Weight'] = df['MV%']
    del df['MV%']
    agg = df.sum()
    agg = agg.to_frame().reset_index()
    agg.columns = ['Column','Portfolio']
    deviation = 0.001
    agg['Min'] = agg['Portfolio'] - deviation
    agg['Max'] = agg['Portfolio'] + deviation
    agg['Constraint'] = True
    return agg