module App.Update exposing (update)

import App.Model exposing (App, Page(..))
import App.Msg exposing (Msg(..))

import Race.Model exposing (Race)
import Array exposing (Array, fromList, get)
--import RaceAdd.Update

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
    Increment ->
      { app | counter = app.counter + 1, page = Home }
        ! [ Navigation.newUrl ( toHash Home ) ]
     

    GoToRiders ->
      ( 
        { app | page = Riders }
      , Navigation.newUrl ( toHash Riders )
      )

    Add -> 
      ( { app | races = Array.push (Race "race c") app.races}
      , Cmd.none
      )

    RaceAdd msg -> 
      ( { app | races = Array.push (Race "hoi") app.races}
      , Cmd.none
      )
      
    GoToRaceAdd ->
      ( { app | page = RaceAddPage }
      , Navigation.newUrl ( toHash RaceAddPage )
      )

    Mdl msg' -> 
      Material.update msg' app


