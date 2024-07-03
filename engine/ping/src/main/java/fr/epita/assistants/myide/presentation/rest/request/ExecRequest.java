package fr.epita.assistants.myide.presentation.rest.request;

import fr.epita.assistants.myide.domain.entity.Feature;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class ExecRequest {
    public String feature;
    public List<String> params;
    public String project;

    @Override
    public String toString() {
        return "ExecRequest{" +
                "feature='" + feature + '\'' +
                ", params=" + params +
                ", project='" + project + '\'' +
                '}';
    }
}
