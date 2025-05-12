def cusinfo():
	info_list = []
	while True:
		try:
			info = list(input().split())
			info_list.append(info)
		except:
			break
	return(info_list)

def cusinfo_dict(L):
	info_dict={}
	for W in L:
		info_dict[W[0]]=[]
		info_num = len(W)-1
		for i in range(info_num):
			info_dict[W[0]].append(W[i+1])
	return(info_dict)

def cus_itemcomparison(D):
	itemlist = []
	unionlist = []
	for cus,item in D.items():
		itemlist.append(item)
	for i in range(1,len(D)):
		itemunion = set(itemlist[i]+itemlist[i-1])
		unionlist.append(itemunion)
	for i in range(1,len(D)):
		for w in itemlist[i]:
			if w in itemlist[i-1]:
	return(unionlist)
cus_dict = cusinfo_dict(cusinfo())