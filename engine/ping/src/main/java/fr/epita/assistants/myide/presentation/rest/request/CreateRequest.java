package fr.epita.assistants.myide.presentation.rest.request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class CreateRequest {
    public String path;
    public String content;
}
