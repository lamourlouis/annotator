import { Relation } from './relation.model';
import { Attribute } from './attribute.model';
import { Entity } from './entity.model';
import { Doc } from './document.model';
import { Event } from './event.model';
import {
  DocumentData,
  rawRelation,
  rawEventLink,
  rawAttribute,
  rawEntity
} from '../annotation/document-data';
import { Project } from './project.model';

export class AnnotatedDocument extends Doc {
  entities: EntityAnnotation[];
  attributes: AttributeAnnotation[];
  relations: RelationAnnotation[];
  events: EventAnnotation[];

  constructor(document: Doc) {
    super(document.documentId, document.title, document.projectId);
    this.entities = [];
    this.attributes = [];
    this.relations = [];
    this.events = [];
    this.text = document.text;
  }
}

export class AnnotatedDocumentUtils {
  static fromJSON(docData: DocumentData, project: Project, annotatedDocument: AnnotatedDocument): AnnotatedDocument {

    annotatedDocument.entities = docData.entities.map(docEntity => {
      const entity: EntityAnnotation = EntityAnnotationUtils.generateEmpty();
      const project_entity = project.entities.find(e => e.type === docEntity[1])

      // Document entity
      entity.id = docEntity[0];
      entity.locations = docEntity[2];

      // Project entity
      entity.name = project_entity.name;
      entity.type = project_entity.type;
      entity.bgColor = project_entity.bgColor;
      entity.labels = project_entity.labels;

      return entity;
    });

    annotatedDocument.attributes = docData.attributes.map(docAttribute => {
      const attribute: AttributeAnnotation = AttributeAnnotationUtils.generateEmpty();
      const project_attribute = project.attributes.find(a => a.type === docAttribute[1])

      // Document attribute
      attribute.id = docAttribute[0];
      attribute.type = docAttribute[1];
      attribute.target = docAttribute[2];

      // Project attribute
      attribute.name = project_attribute.name;
      attribute.values = project_attribute.values;

      return attribute;
    });

    annotatedDocument.relations = docData.relations.map(docRelation => {
      const relation: RelationAnnotation = RelationAnnotationUtils.generateEmpty();
      const project_relation = project.relations.find(r => r.type === docRelation[1])

      // Document relation
      relation.id = docRelation[0];
      relation.type = docRelation[1];
      relation.from.id = docRelation[2][0][0];
      relation.from.role = docRelation[2][0][1];
      relation.to.id = docRelation[2][1][0];
      relation.to.role = docRelation[2][1][1];

      // Project relation
      relation.color = project_relation.color;
      relation.labels = project_relation.labels;
      relation.type = project_relation.type;

      return relation;
    });



    for (let i = 0; i < annotatedDocument.events.length; i++) {
      const docTrigger = docData.triggers[i];
      const docEvent = docData.events[i];
      const projectEvent = project.events.find(e => e.type === docTrigger[1])

      const event: EventAnnotation = EventAnnotationUtils.generateEmpty();
      // Project event
      event.labels = projectEvent.labels;
      event.type = docTrigger[1];
      event.bgColor = projectEvent.bgColor;
      event.attributes = projectEvent.attributes;
      event.name = projectEvent.name;

      // Document event
      event.triggerId = docTrigger[0];
      event.locations = docTrigger[2];
      event.id = docEvent[0];

      event.links = docEvent[2].map(docLink => {
        const link: EventLink = EventLinkUtils.generateEmpty();
        link.id = docLink[1];
        link.type = docLink[0];
        return link;
      });

      annotatedDocument.events.push(event);
    }

    return annotatedDocument;

  }

  static toJSON(annotatedDocument: AnnotatedDocument): string {
    const docData: DocumentData = new DocumentData();
    docData.text = annotatedDocument.text;


    docData.entities = annotatedDocument.entities.map(entity => {
      const e: rawEntity = [entity.id, entity.type, entity.locations];
      return e;
    });

    docData.attributes = annotatedDocument.attributes.map(attribute => {
      const a: rawAttribute = [attribute.id, attribute.type, attribute.target];
      return a;
    });

    docData.relations = annotatedDocument.relations.map(relation => {
      const r: rawRelation = [
        relation.id,
        relation.type,
        [
          [relation.from.role, relation.from.id],
          [relation.to.role, relation.to.id]
        ]
      ];
      return r;
    });

    docData.triggers = [];
    annotatedDocument.events.forEach(event => {
      docData.triggers.push([event.triggerId, event.type, event.locations]);
      docData.events.push([
        event.id,
        event.triggerId,
        event.links.map(link => {
          const l: rawEventLink = [link.type, link.id];
          return l;
        })
      ]);
    });

    docData.comments = [];
    docData.ctime = 1351154734.5055847;
    docData.messages = [];
    docData.modifications = [];
    docData.normalizations = [];
    docData.source_files = [];

    return JSON.stringify(docData);
  }
}

type rangeTextSelection = [number, number];
type id = string;

interface IAnnotation {
  id: id;
}

interface EntityAnnotation extends IAnnotation, Entity {
  locations: rangeTextSelection[];
}

class EntityAnnotationUtils {
  static generateEmpty(): EntityAnnotation {
    return {
      id: '',
      locations: [],
      name: '',
      type: '',
      labels: [],
      bgColor: '',
      borderColor: 'darken',
      unused: false,
      arcs: [],
      children: []
    }
  }
}

interface AttributeAnnotation extends IAnnotation, Attribute {
  target: id;
}

class AttributeAnnotationUtils {
  static generateEmpty(): AttributeAnnotation {
    return {
      id: '',
      name: '',
      type: '',
      labels: [],
      unused: false,
      values: '',
      target: ''
    }
  }
}

interface RelationAnnotation extends IAnnotation, Relation {
  from: RelationLink;
  to: RelationLink;
}

class RelationAnnotationUtils {
  static generateEmpty(): RelationAnnotation {
    return {
      id: '',
      from: { id: '', role: '' },
      to: { id: '', role: '' },
      type: '',
      labels: [],
      dashArray: '3,3',
      color: '',
      attributes: [],
      arcs: []
    }
  }
}

interface RelationLink extends IAnnotation {
  role: string;
}

interface EventAnnotation extends IAnnotation, Event {
  locations: rangeTextSelection[];
  links: EventLink[];
  triggerId: id;
}

class EventAnnotationUtils {
  static generateEmpty(): EventAnnotation {
    return {
      id: '',
      locations: [],
      links: [],
      triggerId: '',
      name: '',
      type: '',
      labels: [],
      bgColor: '',
      borderColor: 'darken',
      attributes: [],
      children: [],
      unused: false,
      arcs: []
    }
  }
}

interface EventLink extends IAnnotation {
  type: string;
}

class EventLinkUtils {
  static generateEmpty(): EventLink {
    return {
      id: '',
      type: ''
    }
  }
}
