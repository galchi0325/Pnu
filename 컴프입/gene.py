def start_end_input():
	S_i = list(input().split())
	E_i = list(input().split())
	return(S_i,E_i)
	
def find_proper_genes(S,E):
	genome = """ATAGTGTCTTCAAAGCTCCAGGTGGTCCTTCTAAATAGCGCCTAAGCAGCTTCCTTATGACAGGGTGTCGGCGATTATTTATCTCTGTGTTCTATTTTTAAGCAAGTTGTCATCATTGAAATAGAGAACTCATTTTTTTGTTTTTTGTATTTCTTCTTTTTTTTGTATGCATTTTTATTTGTGAACTGTAAATTTTCATAACGTTCACAGAGTTTTAAATAATTTACAGTTAAATCAAAATCACTTCACTACATATTGCTACTTCAAATAACTAATCTAACTGGAGTAGTGGTGTTAAACAGGAATCACGAGGCGAAGAAATCCAGTACGTGTAAACGAGCGAACGAATGAGATTATCAGTTATATTTTCATCGTCATTGTCGCGTGGACAATACACTAAACATATCGCTAAAGCTTCATCTACACGATTAGCGAAAATTTTATATGGAATTGACACCTCGCACGCAGATTTCTGCATACGATTGCACATTGTGAACAAATATGCTATTCGTGTATAAACGCCTTAAAACACATGGGTGGTCGAAT"""
	gene_list = list(genome)
	gene_list_count = len(gene_list)-3
	gene_panals = []
	for start in S:
		for end in E:
			S_int = len(start)
			E_int = len(end)
			result = []
			for i in range(gene_list_count):
				Genes =gene_list[i:i+S_int]
				result.append("".join(Genes))
			gene_string = ''
			for j in result:
				J = list(j)
				if j==start:
					if gene_string == '':
						gene_string = j
					else:
						gene_string = ''
				else:
					gene_string_1st = ''.join(list(gene_string)[0:S_int])
					gene_string_last = ''.join(list(gene_string)[-E_int:])
					gene_string_length = len(gene_string)
					if gene_string_last == end and gene_string_1st == start and gene_string_length >= S_int+E_int:
						gene_panals.append(gene_string)
						gene_string = ''	
					elif gene_string_1st == start:
						gene_string+=J[3]
	all = S+E
	for pattern in all:
		for panal in gene_panals:
			panal_middle = ''.join(list(panal)[1:-1])
			if pattern in panal_middle:
				if panal in gene_panals:
					gene_panals.remove(panal)
	return(gene_panals)

def find_shortest_panal(L):
	if L == []:
		return('None')
	else:
		shortest_panal = sorted(L)[0]
		return(shortest_panal)

S_i,E_i = start_end_input()
gene_panals_list = find_proper_genes(S_i,E_i)
print(find_shortest_panal(gene_panals_list))
