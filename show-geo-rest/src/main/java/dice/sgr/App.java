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
 * Hello world!
 *
 */
@SpringBootApplication
public class App {
	public static final Map<String, DatasetGeoInfo> DATA_MAP = new HashMap<>();
	
	public static final Set<UiDataItem> UI_DATA_ITEMS = new HashSet<>();

	public static void main(String[] args) {
		// Query for data
		loadData();
		// Start the server
		SpringApplication.run(App.class, args);
	}

	public static void loadData() {
		// Clear existing records
		DATA_MAP.clear();
		UI_DATA_ITEMS.clear();
		// Query the Sparql endpoint
		List<QuerySolution> resultList = SparqlUtil.executeSparql(QueryStore.QUERY1.toString());

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
				Coordinate newCoord = new Coordinate(x, y);
				coordinates.add(newCoord);
			}
			// Fill formatted data here
			addFormattedUiData(datasetUri, polygon);
			// The rest of the steps are for future use
			DatasetGeoInfo geoInfo = DATA_MAP.get(datasetUri);
			if(geoInfo == null) {
				List<Polygon> polygons = new ArrayList<>();
				geoInfo = new DatasetGeoInfo(datasetUri, polygons);
				DATA_MAP.put(datasetUri, geoInfo);
			}
			geoInfo.addGeoEntry(polygon);
		}
	}
	
	private static void addFormattedUiData(String datasetUri, Polygon polygon) {
		UiDataItem dataItem = new UiDataItem(polygon.getCenterCoords(), datasetUri);
		UI_DATA_ITEMS.add(dataItem);
	}

}
