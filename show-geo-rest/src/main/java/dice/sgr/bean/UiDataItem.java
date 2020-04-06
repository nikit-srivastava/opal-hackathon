package dice.sgr.bean;

import java.util.Arrays;

public class UiDataItem {
	
	float[] coordinates;
	String datasetUri;
	public UiDataItem(float[] coordinates, String datasetUri) {
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
	public String getDatasetUri() {
		return datasetUri;
	}
	public void setDatasetUri(String datasetUri) {
		this.datasetUri = datasetUri;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Arrays.hashCode(coordinates);
		result = prime * result + ((datasetUri == null) ? 0 : datasetUri.hashCode());
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
		if (datasetUri == null) {
			if (other.datasetUri != null)
				return false;
		} else if (!datasetUri.equals(other.datasetUri))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "UiDataItem [coordinates=" + Arrays.toString(coordinates) + ", datasetUri=" + datasetUri + "]";
	}	
	
}
