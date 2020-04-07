package dice.sgr;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.jena.query.QuerySolution;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import dice.sgr.bean.Coordinate;
import dice.sgr.bean.DatasetGeoInfo;
import dice.sgr.bean.Polygon;
import dice.sgr.bean.UiDataItem;
import dice.sgr.util.SparqlUtil;

/**
 * Main class that queries the EU Data portal for the location of datasets and
 * then starts a rest service that offers the fetched data.
 * 
 * @author Nikit
 *
 */
@SpringBootApplication
public class App {
	// Data map to maintain Geo data fetched
	public static final Map<String, DatasetGeoInfo> DATA_MAP = new HashMap<>();
	// Set of items for User Interface to pull
	public static final Set<UiDataItem> UI_DATA_ITEMS = new HashSet<>();
	// Map to maintain Datasets linked to the same coordinate
	public static final Map<Coordinate, UiDataItem> UI_DATA_MAP = new HashMap<Coordinate, UiDataItem>();
	
	public static void main(String[] args) {
		// Query for data
		loadData();
		// Start the server
		SpringApplication.run(App.class, args);
		// Print success message
		System.out.println("Server Started Succesfully");
	}
	/**
	 * Method to structure and load the data fetched from sparql into memory
	 */
	public static void loadData() {
		// Clear existing records
		DATA_MAP.clear();
		UI_DATA_ITEMS.clear();
		// Query the Sparql endpoint
		List<QuerySolution> resultList = SparqlUtil.executeSparql(QueryStore.QUERY1.toString());
		// Extract and store the data fetched iteratively
		for (QuerySolution solution : resultList) {
			String datasetUri = solution.get("dataset").asResource().getURI();
			String polyString = solution.get("propval").asLiteral().getLexicalForm();
			List<Coordinate> coordinates = new ArrayList<>();
			Polygon polygon = new Polygon(coordinates);
			Matcher m = Pattern.compile("\\d+\\.\\d+").matcher(polyString);
			while (m.find()) {
				String x = m.group();
				m.find();
				String y = m.group();
				Coordinate newCoord = new Coordinate(Float.parseFloat(x), Float.parseFloat(y));
				coordinates.add(newCoord);
			}
			// Fill formatted data here
			addFormattedUiData(datasetUri, polygon);
			// The rest of the steps are for future use
			DatasetGeoInfo geoInfo = DATA_MAP.get(datasetUri);
			if (geoInfo == null) {
				List<Polygon> polygons = new ArrayList<>();
				geoInfo = new DatasetGeoInfo(datasetUri, polygons);
				DATA_MAP.put(datasetUri, geoInfo);
			}
			geoInfo.addGeoEntry(polygon);
		}
		// Put all the Data in the set for User Interface
		UI_DATA_ITEMS.addAll(UI_DATA_MAP.values());
	}
	/**
	 * Method to format and store the geo data for User Interface
	 * @param datasetUri - Uri for the dataset
	 * @param polygon - Coordinates of the Polygon fetched
	 */
	private static void addFormattedUiData(String datasetUri, Polygon polygon) {
		float[] coords = polygon.getCenterCoords();
		Coordinate coordinate = new Coordinate(coords[0], coords[1]);
		UiDataItem dataItem = UI_DATA_MAP.get(coordinate);
		if (dataItem == null) {
			Set<String> uriSet = new HashSet<String>();
			dataItem = new UiDataItem(coords, uriSet);
			UI_DATA_MAP.put(coordinate, dataItem);
		}
		dataItem.addUri(datasetUri);
	}

}
