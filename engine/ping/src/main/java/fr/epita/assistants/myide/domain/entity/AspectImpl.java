package fr.epita.assistants.myide.domain.entity;

import fr.epita.assistants.myide.domain.entity.any.*;
import fr.epita.assistants.myide.domain.entity.git.*;
import fr.epita.assistants.myide.domain.entity.maven.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

public class AspectImpl implements Aspect{

    private final Type type;

    @Getter
    private List<Feature> featureList;

    public AspectImpl(Type type){
        this.type = type;
        this.featureList = new ArrayList<>();
        if (type == Mandatory.Aspects.GIT){
            featureList.add(new AddGitFeature());
            featureList.add(new CommitGitFeature());
            featureList.add(new PullGitFeature());
            featureList.add(new PushGitFeature());
            featureList.add(new StatusGitFeature());
        }
        if (type == Mandatory.Aspects.ANY){
            featureList.add(new CleanupAnyFeature());
            featureList.add(new DistAnyFeature());
            featureList.add(new SearchAnyFeature());
        }
        if (type == Mandatory.Aspects.MAVEN){
            featureList.add(new CompileMavenFeature());
            featureList.add(new ExecMavenFeature());
            featureList.add(new CleanMavenFeature());
            featureList.add(new TestMavenFeature());
            featureList.add(new PackageMavenFeature());
            featureList.add(new InstallMavenFeature());
            featureList.add(new TreeMavenFeature());
        }
    }

    @Override
    public Type getType() {
        return type;
    }

}
