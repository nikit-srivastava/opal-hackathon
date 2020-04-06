package dice.sgr.bean;

import java.util.ArrayList;
import java.util.List;

public class Polygon {

	List<Coordinate> coordinates;

	public Polygon(Coordinate... coordinates) {
		this.coordinates = new ArrayList<>();
		for (Coordinate entry : coordinates) {
			this.coordinates.add(entry);
		}
	}

	public Polygon(List<Coordinate> coordinates) {
		super();
		this.coordinates = coordinates;
	}

	public List<Coordinate> getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(List<Coordinate> coordinates) {
		this.coordinates = coordinates;
	}

	public void addCoordinate(Coordinate coordinate) {
		this.coordinates.add(coordinate);
	}

	public float[] getCenterCoords() {
		int size = coordinates.size();
		float xVal = 0;
		float yVal = 0;
		for (Coordinate coordinate : coordinates) {
			xVal += Float.parseFloat(coordinate.getX());
			yVal += Float.parseFloat(coordinate.getY());
		}

		float res[] = { (xVal / (float) size), (yVal / (float) size) };
		return res;
	}

	@Override
	public String toString() {
		return "Polygon [coordinates=" + coordinates + "]";
	}

}
