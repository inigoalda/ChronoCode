package fr.epita.assistants.myide.domain.entity;

import fr.epita.assistants.myide.utils.Logger;

import java.io.File;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;


public class ProjectImpl implements Project {

    public Node root;
    public Set<Aspect> aspects;

    public ProjectImpl(Path root) {
        try {
            this.root = new NodeImpl(root);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        this.aspects = new HashSet<>();
        aspects.add(new AspectImpl(Mandatory.Aspects.ANY));

        File gitDir = new File(root.toString(), ".git");

        if (gitDir.exists() && gitDir.isDirectory())
        {
            aspects.add(new AspectImpl(Mandatory.Aspects.GIT));
        }

        File pomFile = new File(root.toString(), "pom.xml");

        if (pomFile.exists() && pomFile.isFile())
        {
            aspects.add(new AspectImpl(Mandatory.Aspects.MAVEN));
        }
    }

    @Override
    public Node getRootNode() {
        return root;
    }

    @Override
    public Set<Aspect> getAspects() {
        return aspects;
    }

    @Override
    public Optional<Feature> getFeature(Feature.Type featureType) {
        if (featureType.getClass() == Mandatory.Features.Git.class) {
            return findFeatureByAspectType(Mandatory.Aspects.GIT, featureType);
        } else if (featureType.getClass() == Mandatory.Features.Any.class) {
            return findFeatureByAspectType(Mandatory.Aspects.ANY, featureType);
        } else if (featureType.getClass() == Mandatory.Features.Maven.class) {
            return findFeatureByAspectType(Mandatory.Aspects.MAVEN, featureType);
        }
        return Optional.empty();
    }

    private Optional<Feature> findFeatureByAspectType(Mandatory.Aspects aspectType, Feature.Type featureType) {
        for (Aspect aspect : aspects) {
            if (aspect.getType() == aspectType) {
                FeatureFactory f = new FeatureFactory(featureType);
                return Optional.of(f.getFeature());
            }
        }
        return Optional.empty();
    }
}