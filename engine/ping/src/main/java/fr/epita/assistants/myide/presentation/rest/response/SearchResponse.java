package fr.epita.assistants.myide.presentation.rest.response;

import fr.epita.assistants.myide.domain.entity.any.SearchAnyFeatureHelp;

import java.util.List;

public class SearchResponse {

    public List<SearchAnyFeatureHelp> l;

    public SearchResponse(List<SearchAnyFeatureHelp> l){
        this.l = l;
    }
}
