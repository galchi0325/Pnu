def start_end_input():
	S_i = list(input().split())
	E_i = list(input().split())
	return(S_i,E_i)
	

genome = """ATAGTGTCTTCAAAGCTCCAGGTGGTCCTTCTAAATAGCGCCTAAGCAGCTTCCTTATGACAGGGTGTCGGCGATTATTTATCTCTGTGTTCTATTTTTAAGCAAGTTGTCATCATTGAAATAGAGAACTCATTTTTTTGTTTTTTGTATTTCTTCTTTTTTTTGTATGCATTTTTATTTGTGAACTGTAAATTTTCATAACGTTCACAGAGTTTTAAATAATTTACAGTTAAATCAAAATCACTTCACTACATATTGCTACTTCAAATAACTAATCTAACTGGAGTAGTGGTGTTAAACAGGAATCACGAGGCGAAGAAATCCAGTACGTGTAAACGAGCGAACGAATGAGATTATCAGTTATATTTTCATCGTCATTGTCGCGTGGACAATACACTAAACATATCGCTAAAGCTTCATCTACACGATTAGCGAAAATTTTATATGGAATTGACACCTCGCACGCAGATTTCTGCATACGATTGCACATTGTGAACAAATATGCTATTCGTGTATAAACGCCTTAAAACACATGGGTGGTCGAAT"""
gene_list = list(genome)
gene_list_count = len(gene_list)-3

result = []
for i in range(gene_list_count):
	Genes =gene_list[i:i+4]
	result.append("".join(Genes))
#스타트 마커와 같은 유전자 개수 찾기 까지는 성공
i=0
gene_panals = []
gene_string = ''
for j in result:
	J = list(j)
	if j=='GTGT':
		if gene_string == '':
			gene_string = j
		else:
			gene_panals.append(gene_string)
			gene_string = j
	else:
		gene_srting_1st = ''.join(list(gene_string)[0:4])
		if gene_srting_1st == 'GTGT':
			gene_string+=J[3]
			
print(gene_panals)
		
