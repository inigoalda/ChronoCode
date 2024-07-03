package fr.epita.assistants.myide.domain.entity.report;

import fr.epita.assistants.myide.domain.entity.Feature;
import org.eclipse.jgit.api.Status;

public record GitFeatureReport(Status status, boolean isSuccess) implements Feature.ExecutionReport {

    public Status getStatusResult(){ return status;}
}

