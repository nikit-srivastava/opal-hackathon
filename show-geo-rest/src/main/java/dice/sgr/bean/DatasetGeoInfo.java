package dice.sgr.bean;

import java.util.List;

public class DatasetGeoInfo {
	
	String datasetUri;
	List<Polygon> geoEntries;
	public DatasetGeoInfo(String datasetUri, List<Polygon> geoEntries) {
		super();
		this.datasetUri = datasetUri;
		this.geoEntries = geoEntries;
	}
	public String getDatasetUri() {
		return datasetUri;
	}
	public void setDatasetUri(String datasetUri) {
		this.datasetUri = datasetUri;
	}
	public List<Polygon> getGeoEntries() {
		return geoEntries;
	}
	public void setGeoEntries(List<Polygon> geoEntries) {
		this.geoEntries = geoEntries;
	}
	public void addGeoEntry(Polygon polygon) {
		this.geoEntries.add(polygon);
	}
	@Override
	public String toString() {
		return "DatasetGeoInfo [datasetUri=" + datasetUri + ", geoEntries=" + geoEntries + "]";
	}
}
