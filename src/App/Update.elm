module App.Update exposing (update)

import App.Model exposing (App, Page(..))
import App.Msg exposing (Msg(..))

import Race.Model exposing (Race)
import Array exposing (Array, fromList, get)
--import RaceAdd.Update
import RaceAdd.Update
import Races.Update

import Material

import Navigation

toHash : Page -> String
toHash page =
  case page of
    Home ->
      "#home"

    Riders ->
      "#riders"
    
    Races ->
      "#races"

    RaceAddPage ->
      "#race-add"

update : Msg -> App -> (App, Cmd Msg)
update msg app =
  case msg of
    RaceAdd subMsg -> 
      let
        ( state, cmd ) =
          ( RaceAdd.Update.update subMsg app.raceAdd)
      in
          ( { app | raceAdd = state }
          , Cmd.map RaceAdd cmd 
          )


    RacesMsg subMsg ->
      let 
          ( updatedRaces, cmd ) =
            Races.Update.update subMsg app.races
      in
          ( { app | races = updatedRaces }
          , Cmd.map RacesMsg cmd
          )

    Mdl msg' -> 
      Material.update msg' app
