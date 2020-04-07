package dice.sgr.bean;

import java.util.Arrays;
import java.util.Set;
/**
 * Class to model single Geo data item to be rendered on UI
 * @author Nikit
 *
 */
public class UiDataItem {
	// 2-dimensional coordinate
	float[] coordinates;
	// Set of related Dataset Uris
	Set<String> datasetUri;
	
	public UiDataItem(float[] coordinates, Set<String> datasetUri) {
		super();
		this.coordinates = coordinates;
		this.datasetUri = datasetUri;
	}
	public float[] getCoordinates() {
		return coordinates;
	}
	public void setCoordinates(float[] coordinates) {
		this.coordinates = coordinates;
	}
	public Set<String> getDatasetUri() {
		return datasetUri;
	}
	public void setDatasetUri(Set<String> datasetUri) {
		this.datasetUri = datasetUri;
	}
	
	public void addUri(String uri) {
		this.datasetUri.add(uri);
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Arrays.hashCode(coordinates);
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		UiDataItem other = (UiDataItem) obj;
		if (!Arrays.equals(coordinates, other.coordinates))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "UiDataItem [coordinates=" + Arrays.toString(coordinates) + ", datasetUri=" + datasetUri + "]";
	}
	
}
