package fr.epita.assistants.myide.presentation.rest.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class UpdateRequest {
    public String path;
    public Integer from;
    public Integer to;
    public String content;

    @Override
    public String toString() {
        return "UpdateRequest{" +
                "path='" + path + '\'' +
                ", from=" + from +
                ", to=" + to +
                ", content='" + content + '\'' +
                '}';
    }
}
