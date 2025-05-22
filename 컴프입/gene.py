def start_end_input():
	S_i = list(input().split())
	E_i = list(input().split())
	return(S_i,E_i)
	
def find_proper_genes(S,E):
	f=open("genome.txt",'r',encoding='cp949')
	genome = "".join(f.read().splitlines())
	
	gene_panals = []
	
	for start in S:
		pos = 0
		while True:
			start_idx = genome.find(start, pos)
			if start_idx == -1:
				break
			for end in E:
				end_idx = genome.find(end, start_idx + len(start))
				if end_idx == -1:
					continue 
				candidate = genome[start_idx:end_idx + len(end)]
				if end_idx < start_idx + len(start):
					continue
				inner = candidate[len(start):-len(end)]
				if all(p not in inner for p in S + E):
					gene_panals.append(candidate)
			pos = start_idx + 1  

	return(gene_panals)

def find_shortest_panal(L):
	if L == []:
		return('None')
	else:
		shortest_panal = min(L,key = lambda x : (len(x),x))
		return(shortest_panal)

S_i,E_i = start_end_input()
gene_panals_list = find_proper_genes(S_i,E_i)
print(find_shortest_panal(gene_panals_list))
