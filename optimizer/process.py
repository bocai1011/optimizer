import numpy
import pandas

__all__ = ['process_df','format_df','calculate_agg','calculate_result_agg']

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

def calculate_result_agg(df):
    agg_columns = ['Duration','Spread','Yield']
    all_agg_columns = ['Weight','New weight'] + agg_columns
    df = df[all_agg_columns].copy()
    for col in agg_columns:
        df['Old '+col] = df['Weight'] * df[col]
        df['New '+col] = df['New weight'] * df[col]
    df1_cols = ['Weight'] + [ 'Old ' + col for col in agg_columns]
    df2_cols = ['New weight'] + [ 'New ' + col for col in agg_columns]
    df1 = df[df1_cols].copy()
    df2 = df[df2_cols].copy()
    df1.columns = ['Weight'] + agg_columns
    df2.columns = ['Weight'] + agg_columns
    agg1 = df1.sum()
    agg2 = df2.sum()
    agg = pandas.concat([agg1,agg2],axis=1)
    agg = agg.reset_index()
    agg.columns = ['Column','Old Portfolio','New Portfolio']
    return agg