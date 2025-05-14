def while_input():
	Mlist = []
	while True:
		try:
			a=list(input().split())
			Mlist.append(a)
		except:
			break
	return(Mlist)
