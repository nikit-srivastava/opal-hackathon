package dice.sgr.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.sparql.engine.http.QueryEngineHTTP;
/**
 * Class to encapsulate Util methods related to Sparql querying
 * @author Nikit
 *
 */
public class SparqlUtil {
	// Endpoint used to fetch the geo dataset
	public static final String EU_DATAPORTAL_SPARQL_ENDPOINT = "https://www.europeandataportal.eu/sparql";
	
	/**
	 * Method to query a given sparql endpoint and return the list of results
	 * @param queryStr - Sparql query to be sent
	 * @return - List of QuerySolution that contains the fetched data
	 */
	public static List<QuerySolution> executeSparql(String queryStr) {
		return executeSparql(queryStr, EU_DATAPORTAL_SPARQL_ENDPOINT);
	}
	
	/**
	 * Method to query a given sparql endpoint and return the list of results
	 * @param queryStr - Sparql query to be sent
	 * @param url - Url of the Sparql endpoint
	 * @return - List of QuerySolution that contains the fetched data
	 */
	public static List<QuerySolution> executeSparql(String queryStr, String url) {
		ResultSet res = null;
		List<QuerySolution> querySolutionList = new ArrayList<>();
		Query query = QueryFactory.create(queryStr.toString());
		// Remote execution.
		try (QueryExecution qexec = QueryExecutionFactory.sparqlService(url, query)) {
			// Set the DBpedia specific timeout.
			((QueryEngineHTTP) qexec).addParam("timeout", "30000");
			// Execute.
			res = qexec.execSelect();
			while(res.hasNext()) {
				querySolutionList.add(res.next());
			}
		} catch (Exception e) {
			System.out.println("Query Failed: "+queryStr);
			e.printStackTrace();
		}
		// sleep
		sleep(1000);
		return querySolutionList;
	}
	
	/**
	 * Method to sleep the current thread for given period of time
	 * @param ms - time in milliseconds
	 */
	public static void sleep(long ms) {
		try {
			Thread.sleep(ms);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

}
