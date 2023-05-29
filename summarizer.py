import sys
import numpy as np
from numpy import dot
from numpy.linalg import norm
import tokenize
import nltk
from nltk.corpus import stopwords
import networkx as nx

def cos_dist(v1, v2):
  return dot(v1, v2) / (norm(v1) * norm(v2))

def read_article(text):        
  sentences =[]        
  sentences = tokenize(text)                # Tokenizer
  for sentence in sentences:                # For-loop checking through and 
    sentence.replace("[^a-zA-Z0-9]"," ")    # removing special characters 
  return sentences

def sentence_similarity(sent1,sent2,stopwords=None):    
  if stopwords is None:        
    stopwords = []        
  sent1 = [w.lower() for w in sent1]    
  sent2 = [w.lower() for w in sent2]
        
  all_words = list(set(sent1 + sent2))   
     
  vector1 = [0] * len(all_words)    
  vector2 = [0] * len(all_words)        
  #build the vector for the first sentence    
  for w in sent1:        
    if not w in stopwords:
      vector1[all_words.index(w)]+=1                                                             
  #build the vector for the second sentence    
  for w in sent2:        
    if not w in stopwords:            
      vector2[all_words.index(w)]+=1 
               
  return 1-cos_dist(vector1,vector2)

def build_similarity_matrix(sentences,stop_words):
  #create an empty similarity matrix
  similarity_matrix = np.zeros((len(sentences),len(sentences)))
  for idx1 in range(len(sentences)):
    for idx2 in range(len(sentences)):
      if idx1!=idx2:
        similarity_matrix[idx1][idx2] = sentence_similarity(sentences[idx1],sentences[idx2],stop_words)
  return similarity_matrix

def generate_summary(text,top_n):
  nltk.download('stopwords')    
  nltk.download('punkt')
  stop_words = stopwords.words('english')    
  summarize_text = []
  # Step 1: read text and tokenize    
  sentences = read_article(text)
  # Step 2: generate similarity matrix            
  sentence_similarity_matrix = build_similarity_matrix(sentences,stop_words)
  # Step 3: Rank sentences in similarity matrix
  sentence_similarity_graph = nx.from_numpy_array(sentence_similarity_matrix)
  scores = nx.pagerank(sentence_similarity_graph)
  # Step 4: sort the rank and place top sentences
  ranked_sentences = sorted(((scores[i],s) for i,s in enumerate(sentences)),reverse=True)
  
  # Step 5: get the top n number of sentences based on rank
  for i in range(top_n):            # Can edit depending on word count
    summarize_text.append(ranked_sentences[i][1])
  # Step 6 : output the summarized version
  return " ".join(summarize_text),len(sentences)
