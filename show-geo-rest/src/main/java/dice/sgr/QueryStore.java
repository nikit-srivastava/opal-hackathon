package dice.sgr;

public class QueryStore {
	public static final StringBuilder QUERY_PREFIX = new StringBuilder();
	public static final StringBuilder QUERY1;
	
	
	static {
		QUERY_PREFIX.append("PREFIX dbo: <http://dbpedia.org/ontology/> ");
		QUERY_PREFIX.append("PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns/> ");
		QUERY_PREFIX.append("PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ");
		QUERY_PREFIX.append("PREFIX dcat: <http://www.w3.org/ns/dcat#> ");
		QUERY_PREFIX.append("PREFIX dct: <http://purl.org/dc/terms/> ");
		
		QUERY1 = new StringBuilder(QUERY_PREFIX);
		QUERY1.append("SELECT distinct ?dataset ?propval WHERE { ");
		QUERY1.append(" ?dataset a dcat:Dataset . ");
		QUERY1.append(" ?dataset dct:spatial ?spatial . ");
		QUERY1.append(" ?spatial <http://www.w3.org/ns/locn#geometry> ?propval . ");
		QUERY1.append(" FILTER ( datatype(?propval) = <http://www.openlinksw.com/schemas/virtrdf#Geometry>) . ");
		QUERY1.append(" FILTER regex(str(?propval), \"^POLYGON.*\")");
		QUERY1.append(" } ");
	}
	

}
