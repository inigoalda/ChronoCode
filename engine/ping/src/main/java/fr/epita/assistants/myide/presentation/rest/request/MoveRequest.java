package fr.epita.assistants.myide.presentation.rest.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class MoveRequest {
    public String src;
    public String dst;

    @Override
    public String toString() {
        return "MoveRequest{" +
                "src='" + src + '\'' +
                ", dst='" + dst + '\'' +
                '}';
    }
}
