package fr.epita.assistants.myide.domain.entity;

import fr.epita.assistants.myide.domain.entity.any.CleanupAnyFeature;
import fr.epita.assistants.myide.domain.entity.any.DistAnyFeature;
import fr.epita.assistants.myide.domain.entity.any.SearchAnyFeature;
import fr.epita.assistants.myide.domain.entity.git.*;
import fr.epita.assistants.myide.domain.entity.maven.*;
import lombok.Getter;

@Getter
public class FeatureFactory {

    private Feature feature;

    FeatureFactory(Feature.Type featureType){
        if (featureType == Mandatory.Features.Git.ADD){
            feature = new AddGitFeature();
        }
        if (featureType == Mandatory.Features.Git.COMMIT){
            feature = new CommitGitFeature();
        }
        if (featureType == Mandatory.Features.Git.PULL){
            feature = new PullGitFeature();
        }
        if (featureType == Mandatory.Features.Git.PUSH){
            feature = new PushGitFeature();
        }
        if (featureType == Mandatory.Features.Git.STATUS)
        {
            feature = new StatusGitFeature();
        }
        if (featureType == Mandatory.Features.Maven.COMPILE){
            feature = new CompileMavenFeature();
        }
        if (featureType == Mandatory.Features.Maven.CLEAN){
            feature = new CleanMavenFeature();
        }
        if (featureType == Mandatory.Features.Maven.TEST){
            feature = new TestMavenFeature();
        }
        if (featureType == Mandatory.Features.Maven.PACKAGE){
            feature = new PackageMavenFeature();
        }
        if (featureType == Mandatory.Features.Maven.INSTALL){
            feature = new InstallMavenFeature();
        }
        if (featureType == Mandatory.Features.Maven.EXEC){
            feature = new ExecMavenFeature();
        }
        if (featureType == Mandatory.Features.Maven.TREE){
            feature = new TreeMavenFeature();
        }
        if (featureType == Mandatory.Features.Any.CLEANUP) {
            feature = new CleanupAnyFeature();
        }
        if (featureType == Mandatory.Features.Any.DIST) {
            feature = new DistAnyFeature();
        }
        if (featureType == Mandatory.Features.Any.SEARCH){
            feature = new SearchAnyFeature();
        }
    }

}
