package dice.sgr.rest;

import java.util.Set;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dice.sgr.App;
import dice.sgr.bean.UiDataItem;

@RestController
@CrossOrigin(origins = "*", allowCredentials = "true")
@RequestMapping("/")
public class SgrRestController {
	
	
	@RequestMapping("/refresh-cache")
	public String greeting() {
		App.loadData();
		return "success";
	}
	
	@RequestMapping("/fetch-data")
	public Set<UiDataItem> getDataItems() {
		return App.UI_DATA_ITEMS;
	}

}
