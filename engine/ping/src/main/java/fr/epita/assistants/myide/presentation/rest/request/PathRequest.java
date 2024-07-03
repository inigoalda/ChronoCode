package fr.epita.assistants.myide.presentation.rest.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class PathRequest {
    public String path;

    @Override
    public String toString() {
        return "PathRequest{" +
                "path='" + path + '\'' +
                '}';
    }
}
