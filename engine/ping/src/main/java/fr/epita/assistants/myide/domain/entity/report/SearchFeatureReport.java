package fr.epita.assistants.myide.domain.entity.report;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.any.SearchAnyFeatureHelp;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @param l All file node where the query have been found.
 * @param isSuccess  Is the report successful.
 */
public record SearchFeatureReport(@NotNull List<SearchAnyFeatureHelp> l, boolean isSuccess) implements Feature.ExecutionReport {
    public List<SearchAnyFeatureHelp> getResults() {
        return l;
    }
}