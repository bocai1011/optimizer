import pulp
import numpy
import pandas

__all__ = ['opti']

def build_ff(df,nn):
    rr = df['Yield'].values.tolist()
    return [ -1*v for v in rr] + rr + [0]*2*nn
    
def build_Ab(df,agg,nn):
    columns = agg.index.tolist()
    columns.remove('Weight')
    AA = []
    bb = []
    for column in columns:
        if agg.loc[column,'Constraint']:
            rr = df[column].values.tolist()
            A1 = rr + [ -1*x for x in rr] + [0]*2*nn
            b1 = agg.loc[column,'Max'] - agg.loc[column,'Portfolio']
            AA.append(A1)
            bb.append(b1)
            A1 = [ -1*x for x in rr] + rr + [0]*2*nn
            b1 = agg.loc[column,'Portfolio'] - agg.loc[column,'Min']
            AA.append(A1)
            bb.append(b1)
    if agg.loc['Weight','Constraint']:
        rr = [1]*nn
        A1 = rr + [ -1*x for x in rr] + [0]*2*nn
        b1 = agg.loc['Weight','Max'] - agg.loc['Weight','Portfolio']
        AA.append(A1)
        bb.append(b1)
        A1 = [ -1*x for x in rr] + rr + [0]*2*nn
        b1 = agg.loc['Weight','Portfolio'] - agg.loc['Weight','Min']
        AA.append(A1)
        bb.append(b1)
    return AA,bb

def build(df,agg):
    nn = len(df)
    AA,bb = build_Ab(df,agg,nn)
    ff = build_ff(df,nn)
    lb = [0]*4*nn
    ub = [1]*4*nn
    return AA,bb,ff,lb,ub

def solve(AA,bb,ff,lb,ub,nn):
    vs1 = pulp.LpVariable.dicts('v',range(nn))
    vs2 = pulp.LpVariable.dicts('v',range(nn,2*nn))
    vs3 = pulp.LpVariable.dicts('v',range(2*nn,3*nn),None,None,pulp.LpInteger)
    vs4 = pulp.LpVariable.dicts('v',range(3*nn,4*nn),None,None,pulp.LpInteger)
    vs = {}
    vs.update(vs1)
    vs.update(vs2)
    vs.update(vs3)
    vs.update(vs4)
    for i in vs:
        vs[i].bounds(lb[i],ub[i])
    prob = pulp.LpProblem("New Problem",pulp.LpMinimize)
    obj = pulp.LpAffineExpression([(vs[i],v) for i,v in enumerate(ff) if v])
    prob += obj
    for i, rr in enumerate(AA):
        constraint = pulp.LpConstraint([(vs[i],v) for i,v in enumerate(rr) if v], pulp.LpConstraintLE,None,bb[i])
        prob += constraint
    solver = pulp.solvers.PULP_CBC_CMD()
    solver.maxSeconds = 120
    prob.setSolver(solver)
    prob.solve()
    xx = [0]*4*nn
    for v in prob.variables():
        s,n = v.name.split('_')
        xx[int(n)] = v.varValue
    xx = numpy.array(xx)
    solution = xx[:nn] - xx[nn:2*nn]
    solution = numpy.round(solution*1e9) / 1e9
    return pulp.LpStatus[prob.status], solution

def opti(df,agg):
    agg.set_index('Column',inplace=True)
    AA,bb,ff,lb,ub = build(df,agg)
    status, solution = solve(AA,bb,ff,lb,ub,len(df))
    return status,solution