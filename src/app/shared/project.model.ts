// structure de données utilisée pour représenter un projet
import { Doc } from './document.model';
import { Entite } from './entite.model';
import { Event } from './event.model';
import { Attribute } from './attribute.model'
import { Relation } from './relation.model';
import { CollectionData } from '../annotation/collection-data';

export class Project {
  id: string;
  title: string;
  description: string;
  admin: string[]; // user ids
  annotators: string[]; // user ids
  corpus: Doc[];
  entities: Entite[];
  attributes: Attribute[];
  events: Event[];
  relations: Relation[];

  constructor(id: string = '', title: string = '', description: string = '') {
    this.id = id;
    this.title = title;
    this.description = description;
    this.admin = [];
    this.annotators = [];
    this.corpus = [];
    this.entities = [];
    this.attributes = [];
    this.events = [];
    this.relations = [];
  }

  toFirebase() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      admin: this.admin,
      annotators: this.annotators,
      corpus: this.corpus,
      tntities: this.entities,
      attributes: this.attributes,
      events: this.events,
      relations: this.relations
    }
  }

  asCollectionData(): CollectionData {
    const collectionData: CollectionData = null;

    collectionData.messages = []

    collectionData.search_config = [
      ['Google', 'http://www.google.com/search?q=%s'],
      ['Wikipedia', 'http://en.wikipedia.org/wiki/Special:Search?search=%s'],
      ['UniProt', 'http://www.uniprot.org/uniprot/?sort=score&query=%s'],
      ['EntrezGene', 'http://www.ncbi.nlm.nih.gov/gene?term=%s'],
      ['GeneOntology', 'http://amigo.geneontology.org/cgi-bin/amigo/search.cgi?search_query=%s&action=new-search&search_constraint=term'],
      ['ALC', 'http://eow.alc.co.jp/%s']
    ];

    collectionData.disambiguator_config = [];

    collectionData.unconfigured_types = [];

    collectionData.ui_names = {
      entities: 'entités',
      events: 'événements',
      relations: 'relations',
      attributes: 'attributs'
    }

    collectionData.entity_types = this.entities.map(x => ({
      name: x.name,
      type: x.type,
      labels: x.labels,
      bgColor: x.bgColor,
      borderColor: 'darken',
      unused: false,
      // TODO: Fill
      attributes: [],
      // TODO: Fill
      arcs: [],
      // TODO: Fill
      children: []
    }));

    collectionData.event_type = this.events.map(x => ({
      name: x.name,
      type: x.type,
      labels: [x.type],
      bgColor: x.color,
      borderColor: 'darken',
      unused: false,
      // TODO: Fill
      attributes: [],
      // TODO: Fill
      children: [],
      // TODO: Fill
      arcs: []
    }));

    collectionData.relation_types = this.relations.map(x => ({
      type: x.type,
      labels: [x.type],
      // TODO: What is this?
      dashArray: '3,3',
      color: x.color,
      // TODO: Fill
      args: []
    }));

    collectionData.entity_attribute_types = this.attributes.map(x => ({
      name: x.name,
      type: x.type,
      labels: [x.type],
      // TODO: Is attribute "valeurs" field supposed to be mapped here?
      values: {
        [x.type]: {
          glyph: x.valeurs[0],
          // TODO: What is this?
          dashArray: '3,3',
          box: ''
        }
      },
      unused: false
    }));

    // TODO: Have something in project to represent this attribute
    collectionData.event_attribute_types = []

    // TODO: Have something in project to represent this attribute
    collectionData.relation_attribute_types = []

    return collectionData;
  }

  toJSON(): string {
    return JSON.stringify(this.asCollectionData());
  }
}
